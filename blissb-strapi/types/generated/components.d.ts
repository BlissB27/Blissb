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

export interface SiteAnnouncement extends Struct.ComponentSchema {
  collectionName: 'components_site_announcements';
  info: {
    displayName: 'announcement';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SiteDiscountModal extends Struct.ComponentSchema {
  collectionName: 'components_site_discount_modals';
  info: {
    displayName: 'discount-modal';
  };
  attributes: {
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    percentOff: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 1;
        },
        number
      >;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'flavor.flavor-option': FlavorFlavorOption;
      'site.announcement': SiteAnnouncement;
      'site.discount-modal': SiteDiscountModal;
    }
  }
}
