pipeline {
	agent any
	environment {
		PROJECT_ID = 'sunny-airfoil-422515-f9'
		CLUSTER_NAME = 'kube'
		LOCATION = 'asia-northeast3-a'
		CREDENTIALS_ID = '3b5a886a-96d6-4d8a-a5b5-7875838dcc2a'
	}
	stages {
		stage("Checkout code") {
			steps {
				checkout scm
			}
		}
		stage('Clone repository') {
			steps {
				git 'https://github.com/ddolly518/3team_fork.git'
			}
		}

		stage('Build image') {
			steps {
				script {	
					myapp = docker.build("ddolly518/hello:${env.BUILD_ID}")
				}
			}
		}
		stage('Test image') {
			steps {
				script {
					myapp.inside {
						sh 'npm install'
						sh 'npm test'
					}
				}
			}
		}
		stage("Push image") {
			steps {
				script {
					docker.withRegistry('https://registry.hub.docker.com', 'ddolly518') {
						myapp.push("latest")
						myapp.push("${env.BUILD_ID}")
					}
				}
			}
		}
		stage('Deploy to GKE') {
			when {
				branch 'master'
			}
			steps {
				sh "sed -i 's/hello:latest/hello:${env.BUILD_ID}/g' deployment.yaml"
				step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, location: env.LOCATION, manifestPattern: 'deployment.yaml', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])
			}
		}
	}
}
