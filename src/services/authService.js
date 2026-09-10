import { supabase } from '../lib/supabaseClient';

export const authService = {
  // =========================================================
  // SIGN UP
  // =========================================================

  signup: async (
    name,
    email,
    password,
    title,
    college,
    phone
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error(
        'Unable to create user account.'
      );
    }

    const { error: profileError } =
      await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          "Name": name,
          "E-mail": email,
          "Title": title,
          "College": college,
          "Phone": phone
        });

    if (profileError) {
      console.error(
        'Profile creation error:',
        profileError
      );

      throw profileError;
    }

    return {
      user: data.user,
      session: data.session
    };
  },

  // =========================================================
  // LOGIN
  // =========================================================

  login: async (
    email,
    password
  ) => {
    const {
      data,
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    return {
      user: data.user,
      session: data.session
    };
  },

  // =========================================================
  // GET CURRENT USER
  // =========================================================

  getCurrentUser: async () => {
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    if (!user) {
      throw new Error(
        'No logged-in user.'
      );
    }

    const {
      data: profile,
      error: profileError
    } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    return {
      id: profile.id,
      name: profile["Name"],
      email: profile["E-mail"],
      title: profile["Title"],
      college: profile["College"],
      phone: profile["Phone"],
      created_at: profile.created_at
    };
  },

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  changePassword: async (
    newPassword
  ) => {
    if (!newPassword) {
      throw new Error(
        'Please enter a new password.'
      );
    }

    if (newPassword.length < 6) {
      throw new Error(
        'Password must contain at least 6 characters.'
      );
    }

    const {
      data,
      error
    } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw error;
    }

    return data;
  },

  // =========================================================
  // LOGOUT
  // =========================================================

  logout: async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    localStorage.removeItem(
      'gv_hr_user'
    );

    localStorage.removeItem(
      'gv_token'
    );
  }
};