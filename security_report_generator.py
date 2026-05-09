#!/usr/bin/env python3
"""
Security Report Generator
Summarizes OWASP Dependency-Check XML + Trivy JSON reports into one final report.
Usage: python3 security_report_generator.py <trivy-report-dir> <output-file>
"""

import json
import xml.etree.ElementTree as ET
import sys
import os
from datetime import datetime
from collections import defaultdict

REPORT_DIR = sys.argv[1] if len(sys.argv) > 1 else "./trivy-report"
OUTPUT_FILE = sys.argv[2] if len(sys.argv) > 2 else "security-summary-report.md"

SEVERITY_ORDER = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "UNKNOWN"]

SEVERITY_EMOJI = {
    "CRITICAL": "🔴",
    "HIGH":     "🟠",
    "MEDIUM":   "🟡",
    "LOW":      "🟢",
    "UNKNOWN":  "⚪",
}

# ─────────────────────────────────────────────
# OWASP Dependency-Check XML Parser
# ─────────────────────────────────────────────
def parse_owasp(xml_path):
    result = {
        "total": 0,
        "by_severity": defaultdict(int),
        "vulnerabilities": []
    }

    if not os.path.exists(xml_path):
        return result

    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()
        ns = {"dc": "https://jeremylong.github.io/DependencyCheck/dependency-check.2.5.xsd"}

        # Try with and without namespace
        deps = root.findall(".//dc:dependency", ns) or root.findall(".//dependency")

        for dep in deps:
            vuln_list = dep.findall("dc:vulnerabilities/dc:vulnerability", ns) or \
                        dep.findall("vulnerabilities/vulnerability")

            pkg_name_el = dep.find("dc:fileName", ns) or dep.find("fileName")
            pkg_name = pkg_name_el.text if pkg_name_el is not None else "Unknown"

            for vuln in vuln_list:
                name_el   = vuln.find("dc:name", ns)   or vuln.find("name")
                sev_el    = vuln.find("dc:severity", ns) or vuln.find("severity")
                desc_el   = vuln.find("dc:description", ns) or vuln.find("description")
                cvss_el   = vuln.find(".//dc:cvssV3/dc:baseScore", ns) or \
                            vuln.find(".//cvssV3/baseScore") or \
                            vuln.find(".//dc:cvssV2/dc:score", ns) or \
                            vuln.find(".//cvssV2/score")

                name  = name_el.text  if name_el  is not None else "N/A"
                sev   = (sev_el.text.upper() if sev_el is not None else "UNKNOWN")
                desc  = desc_el.text[:120] + "..." if desc_el is not None and desc_el.text and len(desc_el.text) > 120 else (desc_el.text if desc_el is not None else "")
                score = cvss_el.text  if cvss_el  is not None else "N/A"

                result["total"] += 1
                result["by_severity"][sev] += 1
                result["vulnerabilities"].append({
                    "source":   "OWASP",
                    "package":  pkg_name,
                    "cve":      name,
                    "severity": sev,
                    "score":    score,
                    "description": desc,
                })
    except Exception as e:
        print(f"[WARN] Could not parse OWASP XML: {e}")

    return result


# ─────────────────────────────────────────────
# Trivy JSON Parser
# ─────────────────────────────────────────────
def parse_trivy(json_path, label):
    result = {
        "label":       label,
        "total":       0,
        "by_severity": defaultdict(int),
        "vulnerabilities": []
    }

    if not os.path.exists(json_path):
        return result

    try:
        with open(json_path) as f:
            data = json.load(f)

        # Trivy JSON can have Results at top level or nested
        results = data.get("Results", [])

        for res in results:
            target = res.get("Target", "unknown")
            vulns  = res.get("Vulnerabilities") or []

            for v in vulns:
                sev  = v.get("Severity", "UNKNOWN").upper()
                pkg  = v.get("PkgName", "unknown")
                cve  = v.get("VulnerabilityID", "N/A")
                ver  = v.get("InstalledVersion", "N/A")
                fix  = v.get("FixedVersion", "No fix")
                desc = v.get("Description", "")
                score = v.get("CVSS", {})
                # Try to get CVSS score
                cvss_score = "N/A"
                for src, cvss_data in score.items():
                    s = cvss_data.get("V3Score") or cvss_data.get("V2Score")
                    if s:
                        cvss_score = str(s)
                        break

                short_desc = desc[:120] + "..." if len(desc) > 120 else desc

                result["total"] += 1
                result["by_severity"][sev] += 1
                result["vulnerabilities"].append({
                    "source":      label,
                    "target":      target,
                    "package":     pkg,
                    "version":     ver,
                    "fixed_in":    fix,
                    "cve":         cve,
                    "severity":    sev,
                    "score":       cvss_score,
                    "description": short_desc,
                })
    except Exception as e:
        print(f"[WARN] Could not parse Trivy JSON {json_path}: {e}")

    return result


# ─────────────────────────────────────────────
# Markdown Report Builder
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

    # Sort by severity
    order_map = {s: i for i, s in enumerate(SEVERITY_ORDER)}
    sorted_vulns = sorted(vulns, key=lambda v: order_map.get(v["severity"], 99))

    if include_target:
        header = "| Severity | CVE | Package | Version | Fixed In | Score | Target |\n"
        sep    = "|----------|-----|---------|---------|----------|-------|--------|\n"
        rows = [
            f"| {SEVERITY_EMOJI[v['severity']]} {v['severity']} "
            f"| `{v['cve']}` "
            f"| `{v['package']}` "
            f"| {v.get('version','N/A')} "
            f"| {v.get('fixed_in','N/A')} "
            f"| {v.get('score','N/A')} "
            f"| {v.get('target','N/A')} |"
            for v in sorted_vulns
        ]
    else:
        header = "| Severity | CVE / ID | Package | Score | Description |\n"
        sep    = "|----------|----------|---------|-------|-------------|\n"
        rows = [
            f"| {SEVERITY_EMOJI[v['severity']]} {v['severity']} "
            f"| `{v['cve']}` "
            f"| `{v['package']}` "
            f"| {v.get('score','N/A')} "
            f"| {v.get('description','')[:80]} |"
            for v in sorted_vulns
        ]

    return header + sep + "\n".join(rows) + "\n"


def build_report(owasp, fs_scan, image_scans):
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # ── Grand totals ──
    all_vulns = owasp["vulnerabilities"] + fs_scan["vulnerabilities"]
    for img in image_scans:
        all_vulns += img["vulnerabilities"]

    grand_total = len(all_vulns)
    grand_by_sev = defaultdict(int)
    for v in all_vulns:
        grand_by_sev[v["severity"]] += 1

    lines = []

    # ── Header ──
    lines += [
        "# 🔐 Security Scan Summary Report",
        f"> **Generated:** {now}  ",
        f"> **Project:** Marketmandu Backend  ",
        f"> **Tools:** OWASP Dependency-Check + Trivy  ",
        "",
        "---",
        "",
        "## 📊 Executive Summary",
        "",
        f"| Metric | Value |",
        f"|--------|-------|",
        f"| Total Vulnerabilities | **{grand_total}** |",
        f"| 🔴 Critical | **{grand_by_sev.get('CRITICAL', 0)}** |",
        f"| 🟠 High     | **{grand_by_sev.get('HIGH', 0)}** |",
        f"| 🟡 Medium   | **{grand_by_sev.get('MEDIUM', 0)}** |",
        f"| 🟢 Low      | **{grand_by_sev.get('LOW', 0)}** |",
        f"| ⚪ Unknown  | **{grand_by_sev.get('UNKNOWN', 0)}** |",
        "",
        "---",
        "",
    ]

    # ── Per-scan summary table ──
    lines += [
        "## 📁 Scan Breakdown",
        "",
        "| Scan | Total | 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low |",
        "|------|-------|-------------|---------|-----------|--------|",
    ]

    all_scans = [
        ("OWASP Dependency-Check", owasp),
        ("Trivy FS Scan", fs_scan),
    ] + [(img["label"], img) for img in image_scans]

    for name, scan in all_scans:
        bsev = scan["by_severity"]
        lines.append(
            f"| {name} | {scan['total']} "
            f"| {bsev.get('CRITICAL',0)} "
            f"| {bsev.get('HIGH',0)} "
            f"| {bsev.get('MEDIUM',0)} "
            f"| {bsev.get('LOW',0)} |"
        )

    lines += ["", "---", ""]

    # ── OWASP Section ──
    lines += [
        "## 🔍 OWASP Dependency-Check",
        "",
        severity_bar(owasp["by_severity"], owasp["total"]),
        "",
        vuln_table(owasp["vulnerabilities"]),
        "",
        "---",
        "",
    ]

    # ── Trivy FS Section ──
    lines += [
        "## 📂 Trivy Filesystem Scan",
        "",
        severity_bar(fs_scan["by_severity"], fs_scan["total"]),
        "",
        vuln_table(fs_scan["vulnerabilities"], include_target=True),
        "",
        "---",
        "",
    ]

    # ── Trivy Image Scans ──
    lines += ["## 🐳 Trivy Docker Image Scans", ""]

    for img in image_scans:
        lines += [
            f"### {img['label']}",
            "",
            severity_bar(img["by_severity"], img["total"]),
            "",
            vuln_table(img["vulnerabilities"], include_target=True),
            "",
        ]

    lines += ["---", ""]

    # ── Critical & High consolidated list ──
    urgent = [v for v in all_vulns if v["severity"] in ("CRITICAL", "HIGH")]
    if urgent:
        lines += [
            "## 🚨 Action Required — Critical & High Vulnerabilities",
            "",
            "These must be addressed immediately:",
            "",
            "| Severity | CVE | Package | Source | Fixed In |",
            "|----------|-----|---------|--------|----------|",
        ]
        for v in sorted(urgent, key=lambda x: (x["severity"] != "CRITICAL", x["cve"])):
            lines.append(
                f"| {SEVERITY_EMOJI[v['severity']]} {v['severity']} "
                f"| `{v['cve']}` "
                f"| `{v['package']}` "
                f"| {v['source']} "
                f"| {v.get('fixed_in', 'N/A')} |"
            )
        lines += ["", "---", ""]

    # ── Footer ──
    lines += [
        "## ℹ️ Notes",
        "",
        "- OWASP Dependency-Check performs best-effort analysis; false positives may exist.",
        "- Trivy image scans reflect vulnerabilities in the final built Docker layers.",
        "- `No fix` in Fixed In column means no patched version is currently available.",
        "- Review [NVD](https://nvd.nist.gov/) for full CVE details.",
        "",
        "_Report generated by security_report_generator.py_",
    ]

    return "\n".join(lines)


# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────
def main():
    print(f"[INFO] Reading reports from: {REPORT_DIR}")

    owasp   = parse_owasp(os.path.join(REPORT_DIR, "dependency-check-report.xml"))
    fs_scan = parse_trivy(os.path.join(REPORT_DIR, "trivy-fs-report.json"), "Trivy FS Scan")

    image_files = {
        "API Gateway":          "marketmandu-apigateway.json",
        "Auth Microservice":    "02_Auth_microservice.json",
        "Ecommerce Microservice": "03_Ecomerce.json",
        "Remainder Microservice": "04_Remainder_microservice.json",
        "Payment Microservice": "05_Payment_microservice.json",
    }

    image_scans = []
    for label, filename in image_files.items():
        path = os.path.join(REPORT_DIR, filename)
        image_scans.append(parse_trivy(path, label))

    report = build_report(owasp, fs_scan, image_scans)

    with open(OUTPUT_FILE, "w") as f:
        f.write(report)

    print(f"[INFO] ✅ Report written to: {OUTPUT_FILE}")

    # Print quick summary to terminal
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