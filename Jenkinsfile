pipeline {
    agent any

    environment {
        NODE_ENV = 'test'
        GIT_REPO_URL = 'https://github.com/mitesh0110/playwright-typescript-fabric.git'
        BRANCH_NAME = 'main'
    }

    stages {
        stage('Checkout GitHub Repo') {
            steps {
                git branch: env.BRANCH_NAME, url: env.GIT_REPO_URL
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    if (fileExists('package-lock.json')) {
                        bat 'npm ci'
                    } else {
                        bat 'npm install'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                bat 'npx playwright install --with-deps'
                bat 'npx playwright test E2ETestScenario.test.ts --project=Edge'
            }
        }

        stage('Archive Results') {
            steps {
                archiveArtifacts artifacts: 'test-results/**/*.*', allowEmptyArchive: true
                archiveArtifacts artifacts: 'allure-report/**/*.*', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
