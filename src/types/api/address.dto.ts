export interface AddressDto {
  address_id: string;
  address_title: string;
  recipient_name: string;
  street_line_1: string;
  street_line_2?: string;
  city_name: string;
  country_code: string;
  zip_code: string;
  phone_number: string;
  is_default_address: boolean;
}
