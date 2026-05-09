pipeline{
    agent {label "dev"}

    stages{ 

        stage("Clone Code"){
           steps{
            git url : "https://github.com/Saroj-kr-tharu/MarketMandu--Backend", branch :"main"
         } }

         stage("OWASP Dependency Check"){
           steps{
            echo "checking the Dependency "
         } }

        stage("Trivy File System Scan") { 
            steps { 
               echo "Scanning Marketmandu Backend Source Code..."
               
               dir('/Agent/workspace/Marketmandu--Backend') {
                     sh "mkdir -p trivy-report "
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

         stage("Trivy Image Scan "){
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

         

         stage("Docker Image Scan"){
           steps{
            echo "Scanning Docker Image "
         } }

         stage("Image Push To Docker hub"){
           steps{
            echo "Scanning Docker Image "
         } }

         stage("K8s Deployment/Pod Restart"){
           steps{
            echo "k8s Deploymnet/Pod restarting  "
         } }
    }

    post{
      success{
         script{
            echo(" Sucessfully Pipeline  and Email Sent ")
         }
      }

      failure {
         script{
            echo(" Failed Pipeline and Email Sent ")
         }
      }
    }
}