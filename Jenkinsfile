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

         stage("scan file system"){
           steps{
            echo "Trivy File Scanning "
         } }

         stage("Docker Image Build"){
           steps{
            echo "Building the Docker Image "
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