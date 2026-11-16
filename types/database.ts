export type UserRole = 'customer' | 'merchant' | 'admin';

export type AccountStatus = 'active' | 'suspended' | 'restricted';

export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type BusinessStatus = 'active' | 'inactive';

export type ProductType = 'regular_offer' | 'surprise_selection';

export type Currency = 'IRR' | 'IRT';

export type FulfillmentType = 'pickup' | 'delivery';

export type NotificationType = 'system' | 'order' | 'merchant' | 'promotion';

export type TicketStatus = 'open' | 'in_review' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          email: string | null;
          avatar_url: string | null;
          account_status: AccountStatus;
          preferred_city: string | null;
          preferred_district: string | null;
          preferred_neighborhood: string | null;
          preferred_neighborhood_slug: string | null;
          approx_latitude: number | null;
          approx_longitude: number | null;
          precise_latitude: number | null;
          precise_longitude: number | null;
          location_method: string | null;
          location_confirmed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          account_status?: AccountStatus;
          preferred_city?: string | null;
          preferred_district?: string | null;
          preferred_neighborhood?: string | null;
          preferred_neighborhood_slug?: string | null;
          approx_latitude?: number | null;
          approx_longitude?: number | null;
          precise_latitude?: number | null;
          precise_longitude?: number | null;
          location_method?: string | null;
          location_confirmed_at?: string | null;
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          account_status?: AccountStatus;
          preferred_city?: string | null;
          preferred_district?: string | null;
          preferred_neighborhood?: string | null;
          preferred_neighborhood_slug?: string | null;
          approx_latitude?: number | null;
          approx_longitude?: number | null;
          precise_latitude?: number | null;
          precise_longitude?: number | null;
          location_method?: string | null;
          location_confirmed_at?: string | null;
        };
      };

      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: UserRole;
        };
        Update: {
          role?: UserRole;
        };
      };

      addresses: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          recipient_name: string;
          phone: string;
          province: string;
          city: string;
          district: string | null;
          address_line: string;
          postal_code: string | null;
          latitude: number | null;
          longitude: number | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          recipient_name: string;
          phone: string;
          province: string;
          city: string;
          district?: string | null;
          address_line: string;
          postal_code?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          is_default?: boolean;
        };
        Update: {
          title?: string;
          recipient_name?: string;
          phone?: string;
          province?: string;
          city?: string;
          district?: string | null;
          address_line?: string;
          postal_code?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          is_default?: boolean;
        };
      };

      merchant_profiles: {
        Row: {
          id: string;
          owner_user_id: string;
          business_name: string;
          slug: string;
          description: string | null;
          business_category_id: string | null;
          logo_url: string | null;
          cover_image_url: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          city: string;
          district: string | null;
          latitude: number | null;
          longitude: number | null;
          verification_status: VerificationStatus;
          business_status: BusinessStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_user_id: string;
          business_name: string;
          slug?: string;
          description?: string | null;
          business_category_id?: string | null;
          logo_url?: string | null;
          cover_image_url?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          city?: string;
          district?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          verification_status?: VerificationStatus;
          business_status?: BusinessStatus;
        };
        Update: {
          business_name?: string;
          slug?: string;
          description?: string | null;
          business_category_id?: string | null;
          logo_url?: string | null;
          cover_image_url?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          city?: string;
          district?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          verification_status?: VerificationStatus;
          business_status?: BusinessStatus;
        };
      };

      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          parent_id: string | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          is_active?: boolean;
          display_order?: number;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          is_active?: boolean;
          display_order?: number;
        };
      };

      products: {
        Row: {
          id: string;
          merchant_id: string;
          category_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          original_price: number;
          discounted_price: number;
          currency: Currency;
          product_type: ProductType;
          image_urls: string[];
          ingredients: string | null;
          allergen_information: string[] | null;
          storage_information: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          merchant_id: string;
          category_id?: string | null;
          name: string;
          slug?: string;
          description?: string | null;
          original_price: number;
          discounted_price: number;
          currency?: Currency;
          product_type?: ProductType;
          image_urls?: string[];
          ingredients?: string | null;
          allergen_information?: string[] | null;
          storage_information?: string | null;
          is_active?: boolean;
        };
        Update: {
          category_id?: string | null;
          name?: string;
          slug?: string;
          description?: string | null;
          original_price?: number;
          discounted_price?: number;
          currency?: Currency;
          product_type?: ProductType;
          image_urls?: string[];
          ingredients?: string | null;
          allergen_information?: string[] | null;
          storage_information?: string | null;
          is_active?: boolean;
        };
      };

      product_inventory: {
        Row: {
          id: string;
          product_id: string;
          available_quantity: number;
          reserved_quantity: number;
          sold_quantity: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          available_quantity?: number;
          reserved_quantity?: number;
          sold_quantity?: number;
        };
        Update: {
          available_quantity?: number;
          reserved_quantity?: number;
          sold_quantity?: number;
        };
      };

      product_availability: {
        Row: {
          id: string;
          product_id: string;
          availability_date: string;
          pickup_start_time: string;
          pickup_end_time: string;
          pickup_enabled: boolean;
          delivery_enabled: boolean;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          availability_date: string;
          pickup_start_time: string;
          pickup_end_time: string;
          pickup_enabled?: boolean;
          delivery_enabled?: boolean;
          is_available?: boolean;
        };
        Update: {
          availability_date?: string;
          pickup_start_time?: string;
          pickup_end_time?: string;
          pickup_enabled?: boolean;
          delivery_enabled?: boolean;
          is_available?: boolean;
        };
      };

      favorites: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
        };
        Update: {};
      };

      store_favorites: {
        Row: {
          id: string;
          user_id: string;
          merchant_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          merchant_id: string;
        };
        Update: {};
      };

      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string | null;
          notification_type: NotificationType;
          is_read: boolean;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body?: string | null;
          notification_type?: NotificationType;
          is_read?: boolean;
          metadata?: Record<string, unknown> | null;
        };
        Update: {
          is_read?: boolean;
        };
      };

      support_tickets: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          message: string;
          status: TicketStatus;
          priority: TicketPriority;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          message: string;
          status?: TicketStatus;
          priority?: TicketPriority;
        };
        Update: {
          status?: TicketStatus;
          priority?: TicketPriority;
        };
      };

      location_neighborhoods: {
        Row: {
          id: string;
          city: string;
          city_slug: string;
          district: string | null;
          district_slug: string | null;
          neighborhood: string;
          neighborhood_slug: string;
          latitude: number | null;
          longitude: number | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          city: string;
          city_slug: string;
          district?: string | null;
          district_slug?: string | null;
          neighborhood: string;
          neighborhood_slug: string;
          latitude?: number | null;
          longitude?: number | null;
          is_active?: boolean;
          display_order?: number;
        };
        Update: {
          city?: string;
          city_slug?: string;
          district?: string | null;
          district_slug?: string | null;
          neighborhood?: string;
          neighborhood_slug?: string;
          latitude?: number | null;
          longitude?: number | null;
          is_active?: boolean;
          display_order?: number;
        };
      };

      location_config: {
        Row: {
          id: number;
          nearby_threshold_km: number;
          pickup_max_distance_km: number;
          delivery_max_distance_km: number;
          default_city: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          nearby_threshold_km?: number;
          pickup_max_distance_km?: number;
          delivery_max_distance_km?: number;
          default_city?: string;
        };
        Update: {
          nearby_threshold_km?: number;
          pickup_max_distance_km?: number;
          delivery_max_distance_km?: number;
          default_city?: string;
        };
      };

      otp_attempts: {
        Row: {
          id: string;
          phone_hash: string;
          attempt_type: string;
          success: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          phone_hash: string;
          attempt_type: string;
          success?: boolean;
        };
        Update: {};
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      account_status: AccountStatus;
      verification_status: VerificationStatus;
      business_status: BusinessStatus;
      product_type: ProductType;
      currency: Currency;
      notification_type: NotificationType;
      ticket_status: TicketStatus;
      ticket_priority: TicketPriority;
    };
  };
};
