pipeline {
    agent any

    options {
        // Prevent concurrent builds on the local Jenkins server
        disableConcurrentBuilds()
        // Display timestamps in the console log
        timestamps()
        // Automatically abort the build if it runs longer than 10 minutes
        timeout(time: 10, unit: 'MINUTES')
    }

    environment {
        // Disable Astro telemetry during the CI build
        ASTRO_TELEMETRY_DISABLED = '1'
        // Set CI flag to true for standard JS environment behavior
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Environment Info') {
            steps {
                echo 'Checking environment details...'
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                // Using `npm ci` ensures clean, repeatable builds based on package-lock.json
                sh 'npm ci'
            }
        }

        stage('Build Project') {
            steps {
                echo 'Building Astro site...'
                sh 'npm run build'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution finished.'
        }
        success {
            echo '🎉 Build succeeded! Static assets generated in the dist/ directory.'
        }
        failure {
            echo '❌ Build failed. Please check the logs above for details.'
        }
    }
}
