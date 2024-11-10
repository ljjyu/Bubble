node {
	def app
	stage('Clone repository') {
		git 'https://github.com/ddolly518/3team_fork.git'
	}
	stage('Build image') {
		app = docker.build("ddolly518/test")
	}
	stage('Test image') {
		app.inside {
			sh 'npm install'
			sh 'npm test'
		}
	}
	stage('Push image') {
		docker.withRegistry('https://registry.hub.docker.com', 'ddolly518') {
			app.push("${env.BUILD_NUMBER}")
			app.push("latest")
		}
	}
}
