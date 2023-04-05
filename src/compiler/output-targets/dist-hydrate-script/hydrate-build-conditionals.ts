import type * as d from '../../../declarations';
import { getBuildFeatures } from '../../app-core/app-data';

export const getHydrateBuildConditionals = (cmps: d.ComponentCompilerMeta[]) => {
  const build = getBuildFeatures(cmps) as d.BuildConditionals;

  build.slotRelocation = true;
  build.lazyLoad = true;
  build.hydrateServerSide = true;
  // TODO: Remove code implementing the CSS variable shim
  build.cssVarShim = false;
  build.hydrateClientSide = true;
  build.isDebug = false;
  build.isDev = false;
  build.isTesting = false;
  build.devTools = false;
  build.lifecycleDOMEvents = false;
  build.profile = false;
  build.hotModuleReplacement = false;
  build.updatable = true;
  build.member = true;
  build.constructableCSS = false;
  build.asyncLoading = true;
  build.appendChildSlotFix = false;
  build.slotChildNodesFix = false;
  build.cloneNodeFix = false;
  build.cssAnnotations = true;
  // TODO: Remove code related to deprecated shadowDomShim field
  build.shadowDomShim = true;
  // TODO: Remove code related to deprecated `safari10` field.
  build.safari10 = false;
  build.hydratedAttribute = false;
  build.hydratedClass = true;
  build.scriptDataOpts = false;
  // TODO: Remove code related to the dynamic import shim
  build.dynamicImportShim = false;
  build.attachStyles = true;

  return build;
};
