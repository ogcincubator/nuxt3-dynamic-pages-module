import type {PublicDynamicPageAttributes} from "../../types";
import { useRuntimeConfig } from '#imports';

export const useDynamicPages = (): Array<PublicDynamicPageAttributes> => {
  const config = useRuntimeConfig().public.dynamicPages;
  return config?.enabled ? config.pages : [];
}
