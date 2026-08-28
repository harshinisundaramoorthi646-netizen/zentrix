import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const PORT = process.env.PORT || 5000;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ZENTRIX API Documentation',
      version: '1.0.0',
      description: 'Comprehensive API documentation for the ZENTRIX CRM & Enterprise Management Backend',
      contact: {
        name: 'ZENTRIX Support',
        email: 'support@zentrix.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Backend Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'usr_admin' },
            email: { type: 'string', example: 'admin@zentrix.com' },
            name: { type: 'string', example: 'Vikram Malhotra' },
            role: { type: 'string', example: 'ADMIN' },
            team: { type: 'string', example: 'MANAGEMENT' },
            status: { type: 'string', example: 'active' },
            performanceScore: { type: 'number', example: 100 },
          },
        },
        Lead: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'ZX-LD-2026-00128' },
            name: { type: 'string', example: 'Rohan Verma' },
            phone: { type: 'string', example: '+91 98765 43210' },
            email: { type: 'string', example: 'rohan@vertexdigital.in' },
            company: { type: 'string', example: 'Vertex Digital Labs' },
            location: { type: 'string', example: 'Bengaluru, KA' },
            source: { type: 'string', example: 'LinkedIn Direct' },
            requirement: { type: 'string', example: 'Full-stack Enterprise SaaS' },
            estimatedBudget: { type: 'number', example: 250000 },
            status: { type: 'string', example: 'Submitted' },
            priority: { type: 'string', example: 'HIGH' },
          },
        },
        Client: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'cli_1' },
            companyName: { type: 'string', example: 'BlueOrbit Technologies' },
            contactPerson: { type: 'string', example: 'Ananya Deshmukh' },
            email: { type: 'string', example: 'ananya@blueorbit.io' },
            phone: { type: 'string', example: '+91 98220 11982' },
            status: { type: 'string', example: 'Active' },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'prj_1' },
            name: { type: 'string', example: 'BlueOrbit Mobile Expense App' },
            client: { type: 'string', example: 'BlueOrbit Technologies' },
            budget: { type: 'number', example: 180000 },
            status: { type: 'string', example: 'Active' },
            progress: { type: 'number', example: 45 },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'tsk_101' },
            taskName: { type: 'string', example: 'Setup OCR Receipt Processing Pipeline' },
            project: { type: 'string', example: 'BlueOrbit Mobile Expense App' },
            status: { type: 'string', example: 'In Progress' },
          },
        },
        Invoice: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'INV-2026-088' },
            clientName: { type: 'string', example: 'BlueOrbit Technologies' },
            amount: { type: 'number', example: 130000 },
            totalAmount: { type: 'number', example: 153400 },
            status: { type: 'string', example: 'Paid' },
          },
        },
      },
    },
  },
  apis: ['./index.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const customDarkVoidCss = `
  body {
    background-color: #05070B !important;
    color: #F5F7FA !important;
    font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
  }
  .swagger-ui {
    background-color: #05070B !important;
    color: #E2E8F0 !important;
  }
  .swagger-ui .topbar {
    background-color: #0D1118 !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    padding: 14px 0 !important;
  }
  .swagger-ui .topbar a span {
    color: #38E8FF !important;
    font-weight: 800 !important;
    font-family: monospace !important;
  }
  .swagger-ui .info {
    margin: 30px 0 !important;
  }
  .swagger-ui .info .title {
    color: #FFFFFF !important;
    font-family: monospace !important;
    font-weight: 800 !important;
    letter-spacing: -0.5px !important;
  }
  .swagger-ui .info p, .swagger-ui .info li, .swagger-ui .info td {
    color: #9BA7B7 !important;
  }
  .swagger-ui .scheme-container {
    background-color: #0D1118 !important;
    box-shadow: none !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 12px !important;
  }
  .swagger-ui .opblock-tag {
    color: #38E8FF !important;
    border-bottom: 1px solid rgba(56, 232, 255, 0.2) !important;
    font-family: monospace !important;
    font-weight: 700 !important;
  }
  .swagger-ui .opblock {
    background-color: #0D1118 !important;
    border-radius: 12px !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    margin: 0 0 16px !important;
  }
  .swagger-ui .opblock .opblock-summary {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  }
  .swagger-ui .opblock .opblock-summary-method {
    border-radius: 8px !important;
    font-family: monospace !important;
    font-weight: 800 !important;
    text-shadow: none !important;
  }
  .swagger-ui .opblock-get .opblock-summary-method {
    background: #38E8FF !important;
    color: #000000 !important;
  }
  .swagger-ui .opblock-post .opblock-summary-method {
    background: #C7FF3D !important;
    color: #000000 !important;
  }
  .swagger-ui .opblock-put .opblock-summary-method {
    background: #3B82F6 !important;
    color: #FFFFFF !important;
  }
  .swagger-ui .opblock-delete .opblock-summary-method {
    background: #EF4444 !important;
    color: #FFFFFF !important;
  }
  .swagger-ui .opblock-get { border-color: rgba(56, 232, 255, 0.3) !important; }
  .swagger-ui .opblock-post { border-color: rgba(199, 255, 61, 0.3) !important; }
  .swagger-ui .opblock-put { border-color: rgba(59, 130, 246, 0.3) !important; }
  .swagger-ui .opblock-delete { border-color: rgba(239, 68, 68, 0.3) !important; }
  .swagger-ui .opblock .opblock-summary-path {
    color: #F1F5F9 !important;
    font-family: monospace !important;
  }
  .swagger-ui .opblock .opblock-summary-description {
    color: #9BA7B7 !important;
  }
  .swagger-ui .btn {
    border-radius: 8px !important;
    border: 1px solid #38E8FF !important;
    color: #38E8FF !important;
    background: transparent !important;
    font-family: monospace !important;
    font-weight: 700 !important;
  }
  .swagger-ui .btn.execute {
    background: #38E8FF !important;
    color: #000000 !important;
  }
  .swagger-ui section.models {
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 12px !important;
    background-color: #0D1118 !important;
  }
  .swagger-ui section.models h4 {
    color: #38E8FF !important;
    font-family: monospace !important;
  }
  .swagger-ui table thead tr td, .swagger-ui table thead tr th {
    color: #9BA7B7 !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  }
  .swagger-ui .parameter__name, .swagger-ui .parameter__type {
    color: #38E8FF !important;
    font-family: monospace !important;
  }
  .swagger-ui textarea, .swagger-ui input[type=text] {
    background: #05070B !important;
    color: #FFFFFF !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 8px !important;
  }
`;

export const setupSwagger = (app) => {
  // Expose JSON spec endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Serve Swagger UI with custom project theme
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customSiteTitle: 'ZENTRIX API Documentation',
      customCss: customDarkVoidCss,
    })
  );

  console.log(`📄 Swagger UI available at http://localhost:${PORT}/api-docs`);
  console.log(`📄 Raw Swagger Spec JSON available at http://localhost:${PORT}/api-docs.json`);
};
