#!/usr/bin/env python3
"""
Security Report Generator
Summarizes OWASP Dependency-Check XML + Trivy JSON reports into one final report.
Usage: python3 security_report_generator.py <trivy-report-dir> <output-file>

Outputs:
  <output-file>.md   — Markdown report (unchanged)
  <output-file>.pdf  — Styled PDF for email / sharing
"""

import json
import xml.etree.ElementTree as ET
import sys
import os
from datetime import datetime
from collections import defaultdict

REPORT_DIR  = sys.argv[1] if len(sys.argv) > 1 else "./trivy-report"
OUTPUT_FILE = sys.argv[2] if len(sys.argv) > 2 else "security-summary-report.pdf"

# Strip any extension and always use .pdf
OUTPUT_FILE = os.path.splitext(OUTPUT_FILE)[0]

SEVERITY_ORDER = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "UNKNOWN"]

SEVERITY_EMOJI = {
    "CRITICAL": "🔴",
    "HIGH":     "🟠",
    "MEDIUM":   "🟡",
    "LOW":      "🟢",
    "UNKNOWN":  "⚪",
}

# ── Severity palette (RGB 0-1) used in PDF ──────────────────────────────────
from reportlab.lib.colors import Color, HexColor, white, black, lightgrey
SEV_COLOR = {
    "CRITICAL": HexColor("#C0392B"),
    "HIGH":     HexColor("#E67E22"),
    "MEDIUM":   HexColor("#F1C40F"),
    "LOW":      HexColor("#27AE60"),
    "UNKNOWN":  HexColor("#95A5A6"),
}
SEV_TEXT_COLOR = {
    "CRITICAL": white,
    "HIGH":     white,
    "MEDIUM":   black,
    "LOW":      white,
    "UNKNOWN":  white,
}

# ─────────────────────────────────────────────
# OWASP Dependency-Check XML Parser
# ─────────────────────────────────────────────
def parse_owasp(xml_path):
    result = {"total": 0, "by_severity": defaultdict(int), "vulnerabilities": []}
    if not os.path.exists(xml_path):
        return result
    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()
        ns = {"dc": "https://jeremylong.github.io/DependencyCheck/dependency-check.2.5.xsd"}
        deps = root.findall(".//dc:dependency", ns) or root.findall(".//dependency")
        for dep in deps:
            vuln_list = dep.findall("dc:vulnerabilities/dc:vulnerability", ns) or \
                        dep.findall("vulnerabilities/vulnerability")
            pkg_name_el = dep.find("dc:fileName", ns) or dep.find("fileName")
            pkg_name = pkg_name_el.text if pkg_name_el is not None else "Unknown"
            for vuln in vuln_list:
                name_el  = vuln.find("dc:name", ns)   or vuln.find("name")
                sev_el   = vuln.find("dc:severity", ns) or vuln.find("severity")
                desc_el  = vuln.find("dc:description", ns) or vuln.find("description")
                cvss_el  = vuln.find(".//dc:cvssV3/dc:baseScore", ns) or \
                           vuln.find(".//cvssV3/baseScore") or \
                           vuln.find(".//dc:cvssV2/dc:score", ns) or \
                           vuln.find(".//cvssV2/score")
                name  = name_el.text  if name_el  is not None else "N/A"
                sev   = sev_el.text.upper() if sev_el is not None else "UNKNOWN"
                desc  = (desc_el.text[:120] + "...") if desc_el is not None and desc_el.text and len(desc_el.text) > 120 \
                        else (desc_el.text if desc_el is not None else "")
                score = cvss_el.text  if cvss_el  is not None else "N/A"
                result["total"] += 1
                result["by_severity"][sev] += 1
                result["vulnerabilities"].append({
                    "source": "OWASP", "package": pkg_name,
                    "cve": name, "severity": sev, "score": score, "description": desc,
                })
    except Exception as e:
        print(f"[WARN] Could not parse OWASP XML: {e}")
    return result


# ─────────────────────────────────────────────
# Trivy JSON Parser
# ─────────────────────────────────────────────
def parse_trivy(json_path, label):
    result = {"label": label, "total": 0, "by_severity": defaultdict(int), "vulnerabilities": []}
    if not os.path.exists(json_path):
        return result
    try:
        with open(json_path) as f:
            data = json.load(f)
        for res in data.get("Results", []):
            target = res.get("Target", "unknown")
            for v in (res.get("Vulnerabilities") or []):
                sev  = v.get("Severity", "UNKNOWN").upper()
                pkg  = v.get("PkgName", "unknown")
                cve  = v.get("VulnerabilityID", "N/A")
                ver  = v.get("InstalledVersion", "N/A")
                fix  = v.get("FixedVersion", "No fix")
                desc = v.get("Description", "")
                cvss_score = "N/A"
                for _, cvss_data in v.get("CVSS", {}).items():
                    s = cvss_data.get("V3Score") or cvss_data.get("V2Score")
                    if s:
                        cvss_score = str(s)
                        break
                short_desc = desc[:120] + "..." if len(desc) > 120 else desc
                result["total"] += 1
                result["by_severity"][sev] += 1
                result["vulnerabilities"].append({
                    "source": label, "target": target, "package": pkg,
                    "version": ver, "fixed_in": fix, "cve": cve,
                    "severity": sev, "score": cvss_score, "description": short_desc,
                })
    except Exception as e:
        print(f"[WARN] Could not parse Trivy JSON {json_path}: {e}")
    return result


# ─────────────────────────────────────────────
# Markdown Report Builder (unchanged logic)
# ─────────────────────────────────────────────
def severity_bar(by_severity, total):
    if total == 0:
        return "No vulnerabilities found ✅"
    parts = []
    for s in SEVERITY_ORDER:
        count = by_severity.get(s, 0)
        if count:
            parts.append(f"{SEVERITY_EMOJI[s]} **{s}**: {count}")
    return "  |  ".join(parts)


def vuln_table(vulns, include_target=False):
    if not vulns:
        return "_No vulnerabilities found._\n"
    order_map = {s: i for i, s in enumerate(SEVERITY_ORDER)}
    sorted_vulns = sorted(vulns, key=lambda v: order_map.get(v["severity"], 99))
    if include_target:
        header = "| Severity | CVE | Package | Version | Fixed In | Score | Target |\n"
        sep    = "|----------|-----|---------|---------|----------|-------|--------|\n"
        rows = [
            f"| {SEVERITY_EMOJI[v['severity']]} {v['severity']} | `{v['cve']}` "
            f"| `{v['package']}` | {v.get('version','N/A')} | {v.get('fixed_in','N/A')} "
            f"| {v.get('score','N/A')} | {v.get('target','N/A')} |"
            for v in sorted_vulns
        ]
    else:
        header = "| Severity | CVE / ID | Package | Score | Description |\n"
        sep    = "|----------|----------|---------|-------|-------------|\n"
        rows = [
            f"| {SEVERITY_EMOJI[v['severity']]} {v['severity']} | `{v['cve']}` "
            f"| `{v['package']}` | {v.get('score','N/A')} | {v.get('description','')[:80]} |"
            for v in sorted_vulns
        ]
    return header + sep + "\n".join(rows) + "\n"


def build_md_report(owasp, fs_scan, image_scans):
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    all_vulns = owasp["vulnerabilities"] + fs_scan["vulnerabilities"]
    for img in image_scans:
        all_vulns += img["vulnerabilities"]
    grand_total = len(all_vulns)
    grand_by_sev = defaultdict(int)
    for v in all_vulns:
        grand_by_sev[v["severity"]] += 1

    lines = [
        "# 🔐 Security Scan Summary Report",
        f"> **Generated:** {now}  ",
        f"> **Project:** Marketmandu Backend  ",
        f"> **Tools:** OWASP Dependency-Check + Trivy  ",
        "", "---", "", "## 📊 Executive Summary", "",
        "| Metric | Value |", "|--------|-------|",
        f"| Total Vulnerabilities | **{grand_total}** |",
        f"| 🔴 Critical | **{grand_by_sev.get('CRITICAL', 0)}** |",
        f"| 🟠 High     | **{grand_by_sev.get('HIGH', 0)}** |",
        f"| 🟡 Medium   | **{grand_by_sev.get('MEDIUM', 0)}** |",
        f"| 🟢 Low      | **{grand_by_sev.get('LOW', 0)}** |",
        f"| ⚪ Unknown  | **{grand_by_sev.get('UNKNOWN', 0)}** |",
        "", "---", "", "## 📁 Scan Breakdown", "",
        "| Scan | Total | 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low |",
        "|------|-------|-------------|---------|-----------|--------|",
    ]
    all_scans = [("OWASP Dependency-Check", owasp), ("Trivy FS Scan", fs_scan)] + \
                [(img["label"], img) for img in image_scans]
    for name, scan in all_scans:
        bsev = scan["by_severity"]
        lines.append(f"| {name} | {scan['total']} | {bsev.get('CRITICAL',0)} "
                     f"| {bsev.get('HIGH',0)} | {bsev.get('MEDIUM',0)} | {bsev.get('LOW',0)} |")
    lines += ["", "---", "", "## 🔍 OWASP Dependency-Check", "",
              severity_bar(owasp["by_severity"], owasp["total"]), "",
              vuln_table(owasp["vulnerabilities"]), "", "---", "",
              "## 📂 Trivy Filesystem Scan", "",
              severity_bar(fs_scan["by_severity"], fs_scan["total"]), "",
              vuln_table(fs_scan["vulnerabilities"], include_target=True), "", "---", "",
              "## 🐳 Trivy Docker Image Scans", ""]
    for img in image_scans:
        lines += [f"### {img['label']}", "",
                  severity_bar(img["by_severity"], img["total"]), "",
                  vuln_table(img["vulnerabilities"], include_target=True), ""]
    lines += ["---", ""]
    urgent = [v for v in all_vulns if v["severity"] in ("CRITICAL", "HIGH")]
    if urgent:
        lines += ["## 🚨 Action Required — Critical & High Vulnerabilities", "",
                  "These must be addressed immediately:", "",
                  "| Severity | CVE | Package | Source | Fixed In |",
                  "|----------|-----|---------|--------|----------|"]
        for v in sorted(urgent, key=lambda x: (x["severity"] != "CRITICAL", x["cve"])):
            lines.append(f"| {SEVERITY_EMOJI[v['severity']]} {v['severity']} | `{v['cve']}` "
                         f"| `{v['package']}` | {v['source']} | {v.get('fixed_in', 'N/A')} |")
        lines += ["", "---", ""]
    lines += ["## ℹ️ Notes", "",
              "- OWASP Dependency-Check performs best-effort analysis; false positives may exist.",
              "- Trivy image scans reflect vulnerabilities in the final built Docker layers.",
              "- `No fix` in Fixed In column means no patched version is currently available.",
              "- Review [NVD](https://nvd.nist.gov/) for full CVE details.", "",
              "_Report generated by security_report_generator.py_"]
    return "\n".join(lines)


# ─────────────────────────────────────────────
# PDF Report Builder (new)
# ─────────────────────────────────────────────
def build_pdf_report(owasp, fs_scan, image_scans, pdf_path):
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
        HRFlowable, KeepTogether,
    )
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import cm
    from reportlab.lib import colors
    from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

    W, H = A4
    BRAND       = HexColor("#1A252F")   # dark navy header
    ACCENT      = HexColor("#2980B9")   # blue accent
    LIGHT_BG    = HexColor("#F4F6F7")
    ALT_ROW     = HexColor("#EBF5FB")
    HEADER_TEXT = white

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=1.8*cm, rightMargin=1.8*cm,
        topMargin=2*cm, bottomMargin=2*cm,
        title="Security Scan Summary Report",
        author="security_report_generator.py",
    )

    base = getSampleStyleSheet()
    styles = {
        "title": ParagraphStyle("ReportTitle",
            fontName="Helvetica-Bold", fontSize=22,
            textColor=white, alignment=TA_CENTER, spaceAfter=4),
        "subtitle": ParagraphStyle("Subtitle",
            fontName="Helvetica", fontSize=10,
            textColor=HexColor("#BDC3C7"), alignment=TA_CENTER, spaceAfter=2),
        "h1": ParagraphStyle("H1",
            fontName="Helvetica-Bold", fontSize=13,
            textColor=ACCENT, spaceBefore=14, spaceAfter=6,
            borderPad=4),
        "h2": ParagraphStyle("H2",
            fontName="Helvetica-Bold", fontSize=11,
            textColor=BRAND, spaceBefore=10, spaceAfter=4),
        "body": ParagraphStyle("Body",
            fontName="Helvetica", fontSize=8.5,
            textColor=HexColor("#2C3E50"), leading=12, spaceAfter=3),
        "note": ParagraphStyle("Note",
            fontName="Helvetica-Oblique", fontSize=7.5,
            textColor=HexColor("#7F8C8D"), leading=11),
        "mono": ParagraphStyle("Mono",
            fontName="Courier", fontSize=7.5,
            textColor=HexColor("#2C3E50"), leading=11),
        "badge_crit": ParagraphStyle("BC",
            fontName="Helvetica-Bold", fontSize=7.5,
            textColor=white, alignment=TA_CENTER),
        "cell": ParagraphStyle("Cell",
            fontName="Helvetica", fontSize=7.5,
            textColor=HexColor("#2C3E50"), leading=10, wordWrap="LTR"),
        "cell_mono": ParagraphStyle("CellMono",
            fontName="Courier", fontSize=7,
            textColor=HexColor("#2C3E50"), leading=10, wordWrap="LTR"),
    }

    story = []

    # ── Cover band ──────────────────────────────────────────────────────────
    now = datetime.now().strftime("%Y-%m-%d  %H:%M:%S")
    cover_data = [
        [Paragraph("Security Scan Summary Report", ParagraphStyle(
            "CoverTitle", fontName="Helvetica-Bold", fontSize=20,
            textColor=white, alignment=TA_CENTER, leading=26, spaceAfter=0))],
        [Paragraph(f"Marketmandu Backend  •  {now}  •  OWASP Dependency-Check + Trivy",
                   ParagraphStyle("CoverSub", fontName="Helvetica", fontSize=9,
                   textColor=HexColor("#BDC3C7"), alignment=TA_CENTER, leading=13))],
    ]
    cover_tbl = Table(cover_data, colWidths=[doc.width],
                      rowHeights=[38, 22])
    cover_tbl.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), BRAND),
        ("TOPPADDING",    (0,0), (0,0),   10),
        ("BOTTOMPADDING", (0,0), (0,0),   0),
        ("TOPPADDING",    (0,1), (0,1),   2),
        ("BOTTOMPADDING", (0,1), (0,1),   10),
        ("LEFTPADDING",   (0,0), (-1,-1), 12),
        ("RIGHTPADDING",  (0,0), (-1,-1), 12),
        ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
        ("ROUNDEDCORNERS", [6]),
    ]))
    story.append(cover_tbl)
    story.append(Spacer(1, 16))

    # ── Aggregate counts ─────────────────────────────────────────────────
    all_vulns = owasp["vulnerabilities"] + fs_scan["vulnerabilities"]
    for img in image_scans:
        all_vulns += img["vulnerabilities"]
    grand_total = len(all_vulns)
    grand_by_sev = defaultdict(int)
    for v in all_vulns:
        grand_by_sev[v["severity"]] += 1

    # ── Summary scorecards — flat 2-row table (no nesting) ─────────────
    story.append(Paragraph("Executive Summary", styles["h1"]))

    card_cols = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "UNKNOWN"]
    card_w = doc.width / 5
    card_data = [
        # Row 0: big numbers
        [Paragraph(str(grand_by_sev.get(s, 0)), ParagraphStyle(
            f"Num_{s}", fontName="Helvetica-Bold", fontSize=28,
            textColor=SEV_TEXT_COLOR[s], alignment=TA_CENTER, leading=32))
         for s in card_cols],
        # Row 1: labels — same background, always visible
        [Paragraph(s, ParagraphStyle(
            f"Lab_{s}", fontName="Helvetica-Bold", fontSize=8,
            textColor=SEV_TEXT_COLOR[s], alignment=TA_CENTER, leading=10))
         for s in card_cols],
    ]
    card_tbl = Table(card_data, colWidths=[card_w] * 5,
                     hAlign="CENTER", spaceBefore=4, spaceAfter=4)
    card_style = [("BACKGROUND", (i, 0), (i, 1), SEV_COLOR[s])
                  for i, s in enumerate(card_cols)]
    card_style += [
        ("TOPPADDING",    (0, 0), (-1, 0), 12),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 2),
        ("TOPPADDING",    (0, 1), (-1, 1), 0),
        ("BOTTOMPADDING", (0, 1), (-1, 1), 10),
        ("LEFTPADDING",   (0, 0), (-1, -1), 4),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 4),
        ("ROUNDEDCORNERS", [5]),
    ]
    card_tbl.setStyle(TableStyle(card_style))
    story.append(card_tbl)
    story.append(Spacer(1, 4))
    story.append(Paragraph(f"Total vulnerabilities detected: <b>{grand_total}</b>", styles["body"]))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1, color=HexColor("#D5D8DC")))
    story.append(Spacer(1, 10))

    # ── Scan breakdown table ─────────────────────────────────────────────
    story.append(Paragraph("Scan Breakdown", styles["h1"]))
    all_scans = [("OWASP Dependency-Check", owasp), ("Trivy FS Scan", fs_scan)] + \
                [(img["label"], img) for img in image_scans]

    hdr = ["Scan", "Total", "Critical", "High", "Medium", "Low"]
    col_w = [6.2*cm, 1.4*cm, 1.4*cm, 1.4*cm, 1.4*cm, 1.4*cm]
    tbl_data = [[Paragraph(h, ParagraphStyle("TH", fontName="Helvetica-Bold",
                  fontSize=8, textColor=white, alignment=TA_CENTER)) for h in hdr]]
    for name, scan in all_scans:
        bsev = scan["by_severity"]
        row = [
            Paragraph(name, styles["cell"]),
            Paragraph(str(scan["total"]), ParagraphStyle("TC", fontName="Helvetica-Bold",
              fontSize=8, alignment=TA_CENTER)),
        ]
        for s in ["CRITICAL","HIGH","MEDIUM","LOW"]:
            cnt = bsev.get(s, 0)
            row.append(Paragraph(str(cnt) if cnt else "—",
                ParagraphStyle(f"TCV_{s}", fontName="Helvetica-Bold" if cnt else "Helvetica",
                  fontSize=8, textColor=SEV_COLOR[s] if cnt else HexColor("#BDC3C7"),
                  alignment=TA_CENTER)))
        tbl_data.append(row)

    scan_tbl = Table(tbl_data, colWidths=col_w, hAlign="LEFT", spaceBefore=4, spaceAfter=8)
    scan_tbl_style = [
        ("BACKGROUND", (0,0), (-1,0), BRAND),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [white, LIGHT_BG]),
        ("GRID",        (0,0), (-1,-1), 0.4, HexColor("#D5D8DC")),
        ("TOPPADDING",  (0,0), (-1,-1), 5),
        ("BOTTOMPADDING",(0,0),(-1,-1), 5),
        ("LEFTPADDING", (0,0), (-1,-1), 6),
        ("RIGHTPADDING",(0,0), (-1,-1), 6),
        ("ALIGN",       (1,0), (-1,-1), "CENTER"),
        ("VALIGN",      (0,0), (-1,-1), "MIDDLE"),
    ]
    scan_tbl.setStyle(TableStyle(scan_tbl_style))
    story.append(scan_tbl)
    story.append(HRFlowable(width="100%", thickness=1, color=HexColor("#D5D8DC")))
    story.append(Spacer(1, 10))

    # ── Helper: render a vuln table ──────────────────────────────────────
    def _vuln_section(title, vulns, include_target=False):
        order_map = {s: i for i, s in enumerate(SEVERITY_ORDER)}
        sorted_v = sorted(vulns, key=lambda v: order_map.get(v["severity"], 99))

        if include_target:
            hdrs    = ["Sev", "CVE", "Package", "Ver", "Fixed In", "Score", "Target"]
            col_ws  = [1.7*cm, 2.6*cm, 2.0*cm, 1.3*cm, 1.7*cm, 1.1*cm, 2.2*cm]
        else:
            hdrs   = ["Sev", "CVE / ID", "Package", "Score", "Description"]
            col_ws = [1.7*cm, 2.8*cm, 2.2*cm, 1.1*cm, 4.8*cm]

        rows = [[Paragraph(h, ParagraphStyle("VTH", fontName="Helvetica-Bold",
                   fontSize=7.5, textColor=white, alignment=TA_CENTER)) for h in hdrs]]

        for v in sorted_v:
            sev = v["severity"]
            sev_cell = Table(
                [[Paragraph(sev, ParagraphStyle("SL",
                    fontName="Helvetica-Bold", fontSize=6,
                    textColor=SEV_TEXT_COLOR[sev], alignment=TA_CENTER))]],
                colWidths=[1.6*cm]
            )
            sev_cell.setStyle(TableStyle([
                ("BACKGROUND", (0,0), (-1,-1), SEV_COLOR[sev]),
                ("TOPPADDING",    (0,0), (-1,-1), 3),
                ("BOTTOMPADDING", (0,0), (-1,-1), 3),
                ("ROUNDEDCORNERS", [3]),
            ]))
            if include_target:
                row = [
                    sev_cell,
                    Paragraph(v.get("cve","N/A"),       styles["cell_mono"]),
                    Paragraph(v.get("package","N/A"),   styles["cell_mono"]),
                    Paragraph(v.get("version","N/A"),   styles["cell"]),
                    Paragraph(v.get("fixed_in","N/A"),  styles["cell"]),
                    Paragraph(v.get("score","N/A"),     styles["cell"]),
                    Paragraph(v.get("target","N/A"),    styles["cell"]),
                ]
            else:
                row = [
                    sev_cell,
                    Paragraph(v.get("cve","N/A"),         styles["cell_mono"]),
                    Paragraph(v.get("package","N/A"),     styles["cell_mono"]),
                    Paragraph(v.get("score","N/A"),       styles["cell"]),
                    Paragraph(v.get("description","")[:100], styles["cell"]),
                ]
            rows.append(row)

        t = Table(rows, colWidths=col_ws, hAlign="LEFT", spaceBefore=4, spaceAfter=8,
                  repeatRows=1)
        t.setStyle(TableStyle([
            ("BACKGROUND",    (0,0), (-1,0), ACCENT),
            ("ROWBACKGROUNDS",(0,1), (-1,-1), [white, ALT_ROW]),
            ("GRID",          (0,0), (-1,-1), 0.3, HexColor("#D5D8DC")),
            ("TOPPADDING",    (0,0), (-1,-1), 4),
            ("BOTTOMPADDING", (0,0), (-1,-1), 4),
            ("LEFTPADDING",   (0,0), (-1,-1), 4),
            ("RIGHTPADDING",  (0,0), (-1,-1), 4),
            ("ALIGN",         (0,0), (-1,-1), "CENTER"),
            ("ALIGN",         (4,1) if not include_target else (6,1), (-1,-1), "LEFT"),
            ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
        ]))

        block = [Paragraph(title, styles["h1"])]
        if not vulns:
            block.append(Paragraph("No vulnerabilities found.", styles["note"]))
        else:
            block.append(t)
        block.append(HRFlowable(width="100%", thickness=0.5, color=HexColor("#D5D8DC")))
        block.append(Spacer(1, 6))
        return block

    # ── OWASP section ────────────────────────────────────────────────────
    story += _vuln_section("OWASP Dependency-Check",
                           owasp["vulnerabilities"], include_target=False)

    # ── FS Scan section ──────────────────────────────────────────────────
    story += _vuln_section("Trivy Filesystem Scan",
                           fs_scan["vulnerabilities"], include_target=True)

    # ── Image sections ───────────────────────────────────────────────────
    story.append(Paragraph("Trivy Docker Image Scans", styles["h1"]))
    for img in image_scans:
        story += _vuln_section(img["label"], img["vulnerabilities"], include_target=True)

    # ── Critical & High action list ──────────────────────────────────────
    urgent = [v for v in all_vulns if v["severity"] in ("CRITICAL", "HIGH")]
    if urgent:
        story.append(Paragraph("Action Required — Critical &amp; High", styles["h1"]))
        story.append(Paragraph(
            "The following vulnerabilities must be addressed immediately:",
            styles["body"]))
        hdrs  = ["Sev", "CVE", "Package", "Source", "Fixed In"]
        col_w2 = [1.4*cm, 3.2*cm, 3.0*cm, 3.0*cm, 2.0*cm]
        rows = [[Paragraph(h, ParagraphStyle("ATH", fontName="Helvetica-Bold",
                  fontSize=7.5, textColor=white, alignment=TA_CENTER)) for h in hdrs]]
        for v in sorted(urgent, key=lambda x: (x["severity"] != "CRITICAL", x["cve"])):
            sev = v["severity"]
            rows.append([
                Table([[Paragraph(sev[:4], ParagraphStyle("ASev",
                    fontName="Helvetica-Bold", fontSize=6.5,
                    textColor=SEV_TEXT_COLOR[sev], alignment=TA_CENTER))]],
                    colWidths=[1.1*cm],
                    style=TableStyle([("BACKGROUND",(0,0),(-1,-1),SEV_COLOR[sev]),
                                      ("TOPPADDING",(0,0),(-1,-1),3),
                                      ("BOTTOMPADDING",(0,0),(-1,-1),3),
                                      ("ROUNDEDCORNERS",[3])])),
                Paragraph(v.get("cve","N/A"),      styles["cell_mono"]),
                Paragraph(v.get("package","N/A"),  styles["cell_mono"]),
                Paragraph(v.get("source","N/A"),   styles["cell"]),
                Paragraph(v.get("fixed_in","N/A"), styles["cell"]),
            ])
        at = Table(rows, colWidths=col_w2, hAlign="LEFT", spaceBefore=4, spaceAfter=8,
                   repeatRows=1)
        at.setStyle(TableStyle([
            ("BACKGROUND",    (0,0), (-1,0), SEV_COLOR["CRITICAL"]),
            ("ROWBACKGROUNDS",(0,1), (-1,-1), [white, HexColor("#FDEDEC")]),
            ("GRID",          (0,0), (-1,-1), 0.3, HexColor("#D5D8DC")),
            ("TOPPADDING",    (0,0), (-1,-1), 4),
            ("BOTTOMPADDING", (0,0), (-1,-1), 4),
            ("LEFTPADDING",   (0,0), (-1,-1), 4),
            ("RIGHTPADDING",  (0,0), (-1,-1), 4),
            ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
        ]))
        story.append(at)
        story.append(HRFlowable(width="100%", thickness=1, color=HexColor("#D5D8DC")))
        story.append(Spacer(1, 8))

    # ── Footer notes ─────────────────────────────────────────────────────
    story.append(Paragraph("Notes", styles["h1"]))
    notes = [
        "OWASP Dependency-Check performs best-effort analysis; false positives may exist.",
        "Trivy image scans reflect vulnerabilities in the final built Docker layers.",
        '"No fix" in Fixed In means no patched version is currently available.',
        "Review https://nvd.nist.gov/ for full CVE details.",
        "Report generated by security_report_generator.py",
    ]
    for n in notes:
        story.append(Paragraph(f"• {n}", styles["note"]))

    doc.build(story)
    print(f"[INFO] ✅ PDF written to: {pdf_path}")


# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────
def main():
    print(f"[INFO] Reading reports from: {REPORT_DIR}")

    owasp   = parse_owasp(os.path.join(REPORT_DIR, "dependency-check-report.xml"))
    fs_scan = parse_trivy(os.path.join(REPORT_DIR, "trivy-fs-report.json"), "Trivy FS Scan")

    image_files = {
        "API Gateway":              "marketmandu-apigateway.json",
        "Auth Microservice":        "02_Auth_microservice.json",
        "Ecommerce Microservice":   "03_Ecomerce.json",
        "Remainder Microservice":   "04_Remainder_microservice.json",
        "Payment Microservice":     "05_Payment_microservice.json",
    }
    image_scans = []
    for label, filename in image_files.items():
        image_scans.append(parse_trivy(os.path.join(REPORT_DIR, filename), label))

    # ── PDF only ──
    build_pdf_report(owasp, fs_scan, image_scans, OUTPUT_FILE + ".pdf")

    # ── Terminal summary ──
    print("\n" + "="*50)
    print("  QUICK SUMMARY")
    print("="*50)
    all_vulns = owasp["vulnerabilities"] + fs_scan["vulnerabilities"]
    for img in image_scans:
        all_vulns += img["vulnerabilities"]
    from collections import Counter
    counts = Counter(v["severity"] for v in all_vulns)
    for sev in SEVERITY_ORDER:
        print(f"  {SEVERITY_EMOJI[sev]} {sev:10}: {counts.get(sev, 0)}")
    print(f"  {'TOTAL':12}: {len(all_vulns)}")
    print("="*50)


if __name__ == "__main__":
    main()