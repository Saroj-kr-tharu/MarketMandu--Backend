pipeline{
    agent {label "dev"}

    stages{ 

      stage("Cleanup Workspace"){
            steps{
                cleanWs()
            }
        }

        stage("Clone Code"){
           steps{
            git url : "https://github.com/Saroj-kr-tharu/MarketMandu--Backend", branch :"main"
         } }

         

          stage("OWASP Dependency Check"){
            steps{
               script {
                  
                     sh 'mkdir -p trivy-report'
                     def dependencyCheckHome = tool 'OWASP Dependency-Check'
                     
                  
                     withCredentials([string(credentialsId: 'NVD_API_KEY', variable: 'NVD_API_KEY')]) {
                        sh """
                           ${dependencyCheckHome}/bin/dependency-check.sh \
                           --scan . \
                           --format XML \
                           --out trivy-report \
                           --prettyPrint \
                           --nvdApiKey \${NVD_API_KEY}
                        """
                     }
               }
               
               dependencyCheckPublisher pattern: 'trivy-report/dependency-check-report.xml'
          }
      }

        stage("Trivy File System Scan") { 
            steps { 
               echo "Scanning Marketmandu Backend Source Code..."
               
               dir('/Agent/workspace/Marketmandu--Backend') {
                     sh "trivy fs \
                        --format json \
                        --output trivy-report/trivy-fs-report.json \
                        --scanners vuln \
                        ." 
               }
            } 
         }


         stage("Docker Image Build"){
           steps{
            echo "Building the Docker Image "

            withCredentials(  [usernamePassword(
                        credentialsId: "dockerHubCreds",
                        passwordVariable:"dockerHubPass" ,
                        usernameVariable:"dockerHubUser" )]
                    ){
                        sh '''
                          echo "Building 01_ApiGateway "
                          cd /Agent/workspace/Marketmandu--Backend/01_ApiGateway
                          docker build -t ${dockerHubUser}/marketmandu-apigateway:latest .

                          echo "Building 02_Auth_microservice "
                          cd /Agent/workspace/Marketmandu--Backend/02_Auth_microservice
                          docker build -t ${dockerHubUser}/marketmandu-auth_microservice:latest .

                          echo "Building 03_Ecomerce "
                          cd /Agent/workspace/Marketmandu--Backend/03_Ecomerce
                          docker build -t ${dockerHubUser}/marketmandu-ecomerce_microservice:latest .

                          echo "Building 04_Remainder_microservice "
                          cd /Agent/workspace/Marketmandu--Backend/04_Remainder_microservice
                          docker build -t ${dockerHubUser}/marketmandu-remainder_microservice:latest .

                          echo "Building 05_Payment_microservice "
                          cd /Agent/workspace/Marketmandu--Backend/05_Payment_microservice
                          docker build -t ${dockerHubUser}/marketmandu-payment_microservice:latest .

                        '''
                     }
          
         } }

         stage("Docker Image Scan "){
           steps{
            echo "Scanning Docker Image "

            withCredentials(  [usernamePassword(
                        credentialsId: "dockerHubCreds",
                        passwordVariable:"dockerHubPass" ,
                        usernameVariable:"dockerHubUser" )]
                    ){
                        
                          echo "Scanning 01_ApiGateway "
                           sh ' trivy image \
                              --format json \
                              --output trivy-report/marketmandu-apigateway.json \
                              --scanners vuln \
                              ${dockerHubUser}/marketmandu-apigateway:latest';

                           echo "Scanning 02_Auth_microservice "
                           sh ' trivy image \
                              --format json \
                              --output trivy-report/02_Auth_microservice.json \
                              --scanners vuln \
                              ${dockerHubUser}/marketmandu-auth_microservice:latest';

                           echo "Scanning 03_Ecomerce "
                           sh ' trivy image \
                              --format json \
                              --output trivy-report/03_Ecomerce.json \
                              --scanners vuln \
                              ${dockerHubUser}/marketmandu-ecomerce_microservice:latest';

                  
                           echo "Scanning 04_Remainder_microservice "
                           sh ' trivy image \
                              --format json \
                              --output trivy-report/04_Remainder_microservice.json \
                              --scanners vuln \
                              ${dockerHubUser}/marketmandu-remainder_microservice:latest';

                           echo "Scanning 05_Payment_microservice "
                           sh ' trivy image \
                              --format json \
                              --output trivy-report/05_Payment_microservice.json \
                              --scanners vuln \
                              ${dockerHubUser}/marketmandu-payment_microservice:latest';

                     }
          
         } }

         

         stage("Image Push To Docker hub"){
           steps{
            echo "Pushing Docker Image to Docker hub "

            withCredentials(  [usernamePassword(
                        credentialsId: "dockerHubCreds",
                        passwordVariable:"dockerHubPass" ,
                        usernameVariable:"dockerHubUser" )]
                    ){
                        sh '''
                          echo "${dockerHubPass}" | docker login -u "${dockerHubUser}" --password-stdin

                          docker push ${dockerHubUser}/marketmandu-apigateway:latest
                          docker push  ${dockerHubUser}/marketmandu-auth_microservice:latest 
                          docker push  ${dockerHubUser}/marketmandu-ecomerce_microservice:latest 
                          docker push  ${dockerHubUser}/marketmandu-remainder_microservice:latest 
                          docker push  ${dockerHubUser}/marketmandu-payment_microservice:latest 
                        '''
                     }
          
         } }

         

         stage("K8s Deployment/Pod Restart"){
           steps{
            echo "k8s Deploymnet/Pod restarting  "
         } }

         stage("Generate Security Report") {
         steps {
            sh """
                  python3 security_report_generator.py \
                  trivy-report \
                  trivy-report/final-security-report.md
            """
         }
      }
    }

    post {

    success {
        script {
            buildUserVars()
            def user = env.BUILD_USER ?: 'System / Webhook'
            emailext(
                mimeType: 'text/html',
                attachmentsPattern: 'trivy-report/final-security-report.md',
                from: 'sarojtestingkrtharu@gmail.com',
                to: 'sarojc11345@gmail.com',
                subject: "✅ Build Success – ${env.JOB_NAME} ",
                body: """
                <html>
                <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f6f8;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:30px;">
                        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.1);overflow:hidden;">
                          
                          <tr>
                            <td style="background:#22c55e;color:#ffffff;padding:20px;text-align:center;">
                              <h1 style="margin:0;font-size:24px;">🎉 Build Successful</h1>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:25px;color:#333333;">
                              <p style="font-size:16px;">Your Jenkins build completed successfully.</p>

                              <table width="100%" style="margin-top:15px;font-size:14px;">
                                <tr>
                                  <td><strong>Project</strong></td>
                                  <td>${env.JOB_NAME}</td>
                                </tr>
                                <tr>
                                  <td><strong>Build Number</strong></td>
                                  <td>#${env.BUILD_NUMBER}</td>
                                </tr>
                                <tr>
                                  <td><strong>Triggered By </strong></td>
                                  <td>#${user}</td>
                                </tr>
                                <tr>
                                  <td><strong>Status</strong></td>
                                  <td style="color:#22c55e;font-weight:bold;">${currentBuild.currentResult}</td>
                                </tr>
                              </table>

                              <div style="margin-top:25px;text-align:center;">
                                <a href="${env.BUILD_URL}"
                                   style="background:#22c55e;color:#ffffff;text-decoration:none;
                                          padding:12px 22px;border-radius:6px;
                                          display:inline-block;font-weight:bold;">
                                  View Build Details
                                </a>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td style="background:#f1f5f9;color:#6b7280;
                                       text-align:center;padding:15px;font-size:12px;">
                              Jenkins CI/CD • ${env.JOB_NAME}
                            </td>
                          </tr>

                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """
            )
        }
    }

    failure {
        script {
            buildUserVars()
            def user = env.BUILD_USER ?: 'System / Webhook'
            emailext(
                mimeType: 'text/html',
                attachmentsPattern: 'trivy-report/final-security-report.md',
                from: 'sarojtestingkrtharu@gmail.com',
                to: 'sarojc11345@gmail.com',
                subject: '❌ Build Failed – Todo App',
                body: """
                <html>
                <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f6f8;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:30px;">
                        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.1);overflow:hidden;">
                          
                          <tr>
                            <td style="background:#ef4444;color:#ffffff;padding:20px;text-align:center;">
                              <h1 style="margin:0;font-size:24px;">🚨 Build Failed</h1>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:25px;color:#333333;">
                              <p style="font-size:16px;">The Jenkins build has failed. Please review the details below.</p>

                              <table width="100%" style="margin-top:15px;font-size:14px;">
                                <tr>
                                  <td><strong>Project</strong></td>
                                  <td>${env.JOB_NAME}</td>
                                </tr>
                                <tr>
                                  <td><strong>Build Number</strong></td>
                                  <td>#${env.BUILD_NUMBER}</td>
                                </tr>
                                <tr>
                                  <td><strong>Triggered By</strong></td>
                                  <td>#${user}</td>
                                </tr>
                                <tr>
                                  <td><strong>Status</strong></td>
                                  <td style="color:#ef4444;font-weight:bold;">${currentBuild.currentResult}</td>
                                </tr>
                              </table>

                              <div style="margin-top:25px;text-align:center;">
                                <a href="${env.BUILD_URL}"
                                   style="background:#ef4444;color:#ffffff;text-decoration:none;
                                          padding:12px 22px;border-radius:6px;
                                          display:inline-block;font-weight:bold;">
                                  View Failure Logs
                                </a>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td style="background:#f1f5f9;color:#6b7280;
                                       text-align:center;padding:15px;font-size:12px;">
                              Jenkins CI/CD • Todo App
                            </td>
                          </tr>

                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """
            )
        }
    }
    }
}