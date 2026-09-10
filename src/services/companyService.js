import { supabase } from '../lib/supabaseClient';

export const companyService = {
  // =========================================================
  // GET ALL COMPANIES
  // =========================================================
  getAll: async () => {
    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error('User is not logged in.');
      }

      const { data, error } = await supabase
        .from('hr_contacts')
        .select('*')
        .eq('placement_officer_id', user.id)
        .not('company_name', 'is', null)
        .order('company_name', {
          ascending: true
        });

      if (error) {
        throw error;
      }

      // Remove duplicate company names
      const uniqueCompanies = [];
      const companyNames = new Set();

      (data || []).forEach((hr) => {
        const companyName = String(
          hr.company_name || ''
        ).trim();

        if (!companyName) {
          return;
        }

        const key = companyName.toLowerCase();

        if (!companyNames.has(key)) {
          companyNames.add(key);

          uniqueCompanies.push({
            id: hr.id,
            name: companyName,
            company_name: companyName,
            location: hr.location || '',
            students_required:
              hr.students_required || 0,
            status: hr.status || 'Active',
            created_at: hr.created_at,
            updated_at: hr.updated_at
          });
        }
      });

      console.log(
        'Companies loaded from Supabase:',
        uniqueCompanies
      );

      return uniqueCompanies;
    } catch (error) {
      console.error(
        'Failed to load companies:',
        error
      );

      throw error;
    }
  },

  // =========================================================
  // GET COMPANY BY ID
  // =========================================================
  getById: async (id) => {
    try {
      if (!id) {
        throw new Error(
          'Company ID is required.'
        );
      }

      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error('User is not logged in.');
      }

      const { data, error } = await supabase
        .from('hr_contacts')
        .select('*')
        .eq('id', id)
        .eq('placement_officer_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        name: data.company_name || '',
        company_name:
          data.company_name || '',
        location: data.location || '',
        students_required:
          data.students_required || 0,
        status: data.status || 'Active',
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error(
        'Failed to load company:',
        error
      );

      throw error;
    }
  },

  // =========================================================
  // CREATE COMPANY
  // =========================================================
  create: async (companyData) => {
    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error('User is not logged in.');
      }

      const companyName = String(
        companyData?.name ||
        companyData?.company_name ||
        ''
      ).trim();

      if (!companyName) {
        throw new Error(
          'Company name is required.'
        );
      }

      const insertData = {
        user_id: user.id,
        placement_officer_id: user.id,
        company_name: companyName,
        location:
          companyData?.location || null,
        students_required:
          companyData?.students_required
            ? Number(
                companyData.students_required
              )
            : null,
        status:
          companyData?.status ||
          'Active'
      };

      const { data, error } = await supabase
        .from('hr_contacts')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log(
        'Company created in Supabase:',
        data
      );

      return {
        id: data.id,
        name: data.company_name || '',
        company_name:
          data.company_name || '',
        location: data.location || '',
        students_required:
          data.students_required || 0,
        status: data.status || 'Active',
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error(
        'Failed to create company:',
        error
      );

      throw error;
    }
  }
};

export default companyService;