export interface PublicDynamicPageAttributes {
  readonly title: string;
  path: string;
  [otherOptions: string]: unknown;
}

export interface DynamicPageAttributes extends PublicDynamicPageAttributes {
  readonly toc?: boolean;
  html: string;
}

export type DynamicPagesPublicOptions = {
  enabled: boolean;
  pages: Array<PublicDynamicPageAttributes>;
}
