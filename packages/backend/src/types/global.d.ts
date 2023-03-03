declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_APPLICATION_CREDENTIALS: string;
    FIREBASE_AUTH_KEY: string;
    FIREBASE_AUTH_DOMAIN: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_STORAGE_BUCKET: string;
    FIREBASE_MESSAGE_SENDER_ID: string;
    FIREBASE_APP_ID: string;
    FIREBASE_MEASUREMENT_ID: string;
    GOOGLE_CREDENTIALS: string;

    SERVER_DOMAIN_NAME: string;
    SERVER_CRTIFICATE_NAME: string;

    FRONTEND_DOMAIN_NAME: string;

    MYSQL_ENDPOINT: string;
    MYSQL_DATABASE: string;
    MYSQL_USERNAME: string;
    MYSQL_PASSWORD: string;

    HASH_CONFIG_ROUND: string;

    RDS_INSTANCE_ENDPOINT: string;
  }
}
