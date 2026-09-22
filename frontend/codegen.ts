import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: '../backend/schema.graphql',
  documents: ['src/repositories/**/*.ts'],
  generates: {
    './src/graphql/generated/': {
      preset: 'client',
      presetConfig: { fragmentMasking: false },
      config: {
        enumsAsTypes: true,
        useTypeImports: true,
        scalars: { Date: 'string', DateTime: 'string' },
      },
    },
  },
}

export default config
