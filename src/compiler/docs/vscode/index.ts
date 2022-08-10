import type * as d from '../../../declarations';
import { getNameText } from '../generate-doc-data';
import { isOutputTargetDocsVscode } from '../../output-targets/output-utils';
import { join } from 'path';

/**
 * Generate [custom data](https://github.com/microsoft/vscode-custom-data) to augment existing HTML types in VS Code.
 * This function writes the custom data as a JSON file to disk, which can be used in VS Code to inform the IDE about
 * custom elements generated by Rindo.
 *
 * The JSON generated by this function must conform to the
 * [HTML custom data schema](https://github.com/microsoft/vscode-html-languageservice/blob/e7ae8a7170df5e721a13cee1b86e293b24eb3b20/docs/customData.schema.json).
 *
 * This function generates custom data for HTML only at this time (it does not generate custom data for CSS).
 *
 * @param compilerCtx the current compiler context
 * @param docsData an intermediate representation documentation derived from compiled Rindo components
 * @param outputTargets the output target(s) the associated with the current build
 */
export const generateVscodeDocs = async (
  compilerCtx: d.CompilerCtx,
  docsData: d.JsonDocs,
  outputTargets: d.OutputTarget[]
): Promise<void> => {
  const vsCodeOutputTargets = outputTargets.filter(isOutputTargetDocsVscode);
  if (vsCodeOutputTargets.length === 0) {
    return;
  }

  await Promise.all(
    vsCodeOutputTargets.map(async (outputTarget: d.OutputTargetDocsVscode): Promise<void> => {
      const json = {
        /**
         * the 'version' top-level field is required by the schema. changes to the JSON generated by Rindo must:
         * - comply with v1.X of the schema _OR_
         * - increment this field as a part of updating the JSON generation. This should be considered a breaking change
         *
         * {@link https://github.com/microsoft/vscode-html-languageservice/blob/e7ae8a7170df5e721a13cee1b86e293b24eb3b20/src/htmlLanguageTypes.ts#L184}
         */
        version: 1.1,
        tags: docsData.components.map((cmp: d.JsonDocsComponent) => ({
          name: cmp.tag,
          description: {
            kind: 'markdown',
            value: cmp.docs,
          },
          attributes: cmp.props
            .filter((p: d.JsonDocsProp): p is DocPropWithAttribute => p.attr !== undefined && p.attr.length > 0)
            .map(serializeAttribute),
          references: getReferences(cmp, outputTarget.sourceCodeBaseUrl),
        })),
      };

      // fields in the custom data may have a value of `undefined`. calling `stringify` will remove such fields.
      const jsonContent = JSON.stringify(json, null, 2);
      await compilerCtx.fs.writeFile(outputTarget.file, jsonContent);
    })
  );
};

/**
 * This type describes external references for a custom element.
 *
 * An internal representation of Microsoft/VS Code's [`IReference` type](https://github.com/microsoft/vscode-html-languageservice/blob/e7ae8a7170df5e721a13cee1b86e293b24eb3b20/src/htmlLanguageTypes.ts#L153).
 */
type TagReference = {
  name: string;
  url: string;
};

/**
 * Generate a 'references' section for a component's documentation.
 * @param cmp the Rindo component to generate a references section for
 * @param repoBaseUrl an optional URL, that when provided, will add a reference to the source code for the component
 * @returns the generated references section, or undefined if no references could be generated
 */
const getReferences = (cmp: d.JsonDocsComponent, repoBaseUrl: string | undefined): TagReference[] | undefined => {
  // collect any `@reference` JSDoc tags on the component
  const references = getNameText('reference', cmp.docsTags).map(([name, url]) => ({ name, url }));

  if (repoBaseUrl) {
    references.push({
      name: 'Source code',
      url: join(repoBaseUrl, cmp.filePath ?? ''),
    });
  }
  if (references.length > 0) {
    return references;
  }
  return undefined;
};

/**
 * A type that describes the attributes that can be used with a custom element.
 *
 * An internal representation of Microsoft/VS Code's [`IAttributeData` type](https://github.com/microsoft/vscode-html-languageservice/blob/e7ae8a7170df5e721a13cee1b86e293b24eb3b20/src/htmlLanguageTypes.ts#L165).
 */
type AttributeData = {
  name: string;
  description: string;
  values?: { name: string }[];
};

/**
 * Utility that provides a type-safe way of making a key K on a type T required.
 *
 * This is preferable than using an intersection of `T & {K: someType}` as it ensures that:
 * - the type of K will always match the type T[K]
 * - it should error should K not exist in `keyof T`
 */
type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * A `@Prop` documentation type with a required 'attr' field
 */
type DocPropWithAttribute = WithRequired<d.JsonDocsProp, 'attr'>;

/**
 * Serialize a component's class member decorated with `@Prop` to be written to disk
 * @param prop the intermediate representation of the documentation to serialize
 * @returns the serialized data
 */
const serializeAttribute = (prop: DocPropWithAttribute): AttributeData => {
  const attribute: AttributeData = {
    name: prop.attr,
    description: prop.docs,
  };
  const values = prop.values
    .filter(
      (jsonDocValue: d.JsonDocsValue): jsonDocValue is Required<d.JsonDocsValue> =>
        jsonDocValue.type === 'string' && jsonDocValue.value !== undefined
    )
    .map((jsonDocValue: Required<d.JsonDocsValue>) => ({ name: jsonDocValue.value }));

  if (values.length > 0) {
    attribute.values = values;
  }
  return attribute;
};
