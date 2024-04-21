/**
 * All the decorators supported by Rindo
 */
export const RINDO_DECORATORS = [
  'Component',
  'Element',
  'Event',
  'Listen',
  'Method',
  'Prop',
  'State',
  'Watch',
] as const;

export type RindoDecorator = (typeof RINDO_DECORATORS)[number];

/**
 * Decorators on class declarations that we remove as part of the compilation
 * process
 */
export const CLASS_DECORATORS_TO_REMOVE = ['Component'] as const satisfies readonly RindoDecorator[];

/**
 * Decorators on class members that we remove as part of the compilation
 * process
 */
export const MEMBER_DECORATORS_TO_REMOVE = [
  'Element',
  'Event',
  'Listen',
  'Method',
  'Prop',
  'State',
  'Watch',
] as const satisfies readonly RindoDecorator[];

/**
 * Decorators whose 'decorees' we need to rewrite during compilation from
 * class fields to instead initialize them in a constructor.
 */
export const CONSTRUCTOR_DEFINED_MEMBER_DECORATORS = ['State', 'Prop'] as const satisfies readonly RindoDecorator[];

/**
 * The names used for the static getters added to Rindo components when they
 * are transformed to remove decorated properties.
 */
export const STATIC_GETTER_NAMES = [
  'COMPILER_META',
  'assetsDirs',
  'cmpMeta',
  'delegatesFocus',
  'elementRef',
  'encapsulation',
  'events',
  'is',
  'listeners',
  'methods',
  'originalStyleUrls',
  'properties',
  'states',
  'style',
  'styleMode',
  'styleUrl',
  'styleUrls',
  'styles',
  'watchers',
] as const;

export type RindoStaticGetter = (typeof STATIC_GETTER_NAMES)[number];
