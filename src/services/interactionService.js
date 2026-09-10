import { supabase } from '../lib/supabaseClient';

export const interactionService = {
  // =========================================================
  // GET ALL INTERACTIONS
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
        .order('updated_at', {
          ascending: false
        });

      if (error) {
        throw error;
      }

      const interactions = (data || [])
        .filter(
          (hr) =>
            hr.last_contact_date ||
            hr.updated_at
        )
        .map((hr) => ({
          id: hr.id,
          hrId: hr.id,
          hrName: hr.name || '',
          companyName:
            hr.company_name || '',
          designation:
            hr.designation || '',
          phone: hr.phone || '',
          email: hr.email || '',
          status: hr.status || '',
          date:
            hr.last_contact_date ||
            hr.updated_at?.split('T')[0] ||
            '',
          interactionDate:
            hr.last_contact_date ||
            hr.updated_at?.split('T')[0] ||
            '',
          location: hr.location || '',
          studentsRequired:
            hr.students_required || 0,
          createdAt: hr.created_at,
          updatedAt: hr.updated_at
        }));

      console.log(
        'Interactions loaded from Supabase:',
        interactions
      );

      return interactions;
    } catch (error) {
      console.error(
        'Failed to load interactions:',
        error
      );

      throw error;
    }
  },

  // =========================================================
  // GET INTERACTION BY ID
  // =========================================================
  getById: async (id) => {
    try {
      if (!id) {
        throw new Error(
          'Interaction ID is required.'
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
        hrId: data.id,
        hrName: data.name || '',
        companyName:
          data.company_name || '',
        designation:
          data.designation || '',
        phone: data.phone || '',
        email: data.email || '',
        status: data.status || '',
        date:
          data.last_contact_date ||
          data.updated_at?.split('T')[0] ||
          '',
        interactionDate:
          data.last_contact_date ||
          data.updated_at?.split('T')[0] ||
          '',
        location: data.location || '',
        studentsRequired:
          data.students_required || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error(
        'Failed to load interaction:',
        error
      );

      throw error;
    }
  },

  // =========================================================
  // CREATE INTERACTION
  // =========================================================
  create: async (interactionData) => {
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

      const hrId =
        interactionData?.hrId ||
        interactionData?.hr_id ||
        interactionData?.id;

      if (!hrId) {
        throw new Error(
          'HR contact is required.'
        );
      }

      const updateData = {
        last_contact_date:
          interactionData?.date ||
          interactionData?.interactionDate ||
          new Date()
            .toISOString()
            .split('T')[0],
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('hr_contacts')
        .update(updateData)
        .eq('id', hrId)
        .eq(
          'placement_officer_id',
          user.id
        )
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log(
        'Interaction saved to Supabase:',
        data
      );

      return {
        id: data.id,
        hrId: data.id,
        hrName: data.name || '',
        companyName:
          data.company_name || '',
        designation:
          data.designation || '',
        phone: data.phone || '',
        email: data.email || '',
        status: data.status || '',
        date:
          data.last_contact_date || '',
        interactionDate:
          data.last_contact_date || '',
        location: data.location || '',
        studentsRequired:
          data.students_required || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error(
        'Failed to create interaction:',
        error
      );

      throw error;
    }
  },

  // =========================================================
  // UPDATE INTERACTION
  // =========================================================
  update: async (
    id,
    interactionData
  ) => {
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

      if (!id) {
        throw new Error(
          'Interaction ID is required.'
        );
      }

      const updateData = {
        last_contact_date:
          interactionData?.date ||
          interactionData?.interactionDate ||
          null,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('hr_contacts')
        .update(updateData)
        .eq('id', id)
        .eq(
          'placement_officer_id',
          user.id
        )
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id,
        hrId: data.id,
        hrName: data.name || '',
        companyName:
          data.company_name || '',
        designation:
          data.designation || '',
        phone: data.phone || '',
        email: data.email || '',
        status: data.status || '',
        date:
          data.last_contact_date || '',
        interactionDate:
          data.last_contact_date || '',
        location: data.location || '',
        studentsRequired:
          data.students_required || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error(
        'Failed to update interaction:',
        error
      );

      throw error;
    }
  }
};

export default interactionService;