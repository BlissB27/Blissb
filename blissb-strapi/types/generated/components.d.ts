import type { Schema, Struct } from '@strapi/strapi';

export interface FlavorFlavorOption extends Struct.ComponentSchema {
  collectionName: 'components_flavor_flavor_options';
  info: {
    displayName: 'flavor-option';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'flavor.flavor-option': FlavorFlavorOption;
    }
  }
}
