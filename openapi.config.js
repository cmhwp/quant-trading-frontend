import { generateService } from '@umijs/openapi';

const openapiConfig = [
  {
    schemaPath: 'http://127.0.0.1:8000/openapi.json',
    // Output directory for generated files
    serversPath: './src/services',
    requestLibPath: "import { request } from '@/lib/request'",
    namespace: 'API',
    // Project name, will create a subdirectory using this name
    projectName: 'quant',
    apiPrefix: '',

    enumStyle: 'string-literal',
  },
];

// Generate all APIs from swagger
const generateAllServices = async () => {
  for (const config of openapiConfig) {
    await generateService(config);
  }
};

generateAllServices();

export default openapiConfig; 