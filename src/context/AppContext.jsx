import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

import { authService } from '../services/authService';
import { hrService } from '../services/hrService';
import { companyService } from '../services/companyService';
import { interactionService } from '../services/interactionService';
import { followUpService } from '../services/followUpService';
import { notificationService } from '../services/notificationService';
import { supabase } from '../lib/supabaseClient';

const AppContext = createContext();

export const AppProvider = ({ children }) => {

  // =========================================================
  // USER
  // =========================================================

  const [user, setUser] = useState(null);


  // =========================================================
  // APPLICATION DATA
  // =========================================================

  const [hrs, setHrs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [notifications, setNotifications] = useState([]);


  // =========================================================
  // LOADING
  // =========================================================

  const [loading, setLoading] = useState(true);


  // =========================================================
  // REMINDER
  // =========================================================

  const [activeReminder, setActiveReminder] = useState(null);


  // =========================================================
  // TOAST
  // =========================================================

  const [toast, setToast] = useState(null);


  // =========================================================
  // QUICK ADD / MODALS
  // =========================================================

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const [activeModal, setActiveModal] = useState(null);


  // =========================================================
  // SHOW TOAST
  // =========================================================

  const showToast = useCallback(
    (message, type = 'success') => {

      setToast({
        message,
        type,
        id: Date.now()
      });

      setTimeout(() => {
        setToast(null);
      }, 3500);
    },
    []
  );


  // =========================================================
  // CLEAR APPLICATION DATA
  // =========================================================

  const clearApplicationData = useCallback(() => {

    setHrs([]);
    setCompanies([]);
    setInteractions([]);
    setFollowUps([]);
    setNotifications([]);
    setActiveReminder(null);

  }, []);


  // =========================================================
  // REFRESH ALL APPLICATION DATA
  // =========================================================

  const refreshAppData = useCallback(
    async () => {

      try {

        const {
          data: { session },
          error: sessionError
        } = await supabase.auth.getSession();


        if (sessionError) {

          console.error(
            'Session check failed:',
            sessionError
          );

          clearApplicationData();

          return;
        }


        if (!session?.user) {

          clearApplicationData();

          return;
        }


        const [
          hrsData,
          compsData,
          intsData,
          folsData,
          notifsData
        ] = await Promise.all([

          // =================================================
          // HR CONTACTS
          // =================================================

          hrService
            .getAll()
            .catch((error) => {

              console.error(
                'Failed to load HR contacts:',
                error
              );

              return [];
            }),


          // =================================================
          // COMPANIES
          // =================================================

          companyService
            .getAll()
            .catch((error) => {

              console.error(
                'Failed to load companies:',
                error
              );

              return [];
            }),


          // =================================================
          // INTERACTIONS
          // =================================================

          interactionService
            .getAll()
            .catch((error) => {

              console.error(
                'Failed to load interactions:',
                error
              );

              return [];
            }),


          // =================================================
          // FOLLOW UPS
          // =================================================

          followUpService
            .getAll()
            .catch((error) => {

              console.error(
                'Failed to load follow-ups:',
                error
              );

              return [];
            }),


          // =================================================
          // NOTIFICATIONS
          // =================================================

          notificationService
            .getAll()
            .catch((error) => {

              console.error(
                'Failed to load notifications:',
                error
              );

              return [];
            })

        ]);


        // =====================================================
        // UPDATE APPLICATION STATE
        // =====================================================

        setHrs(hrsData || []);

        setCompanies(
          compsData || []
        );

        setInteractions(
          intsData || []
        );

        setFollowUps(
          folsData || []
        );

        setNotifications(
          notifsData || []
        );


      } catch (error) {

        console.error(
          'Application data refresh error:',
          error
        );

      }

    },
    [clearApplicationData]
  );


  // =========================================================
  // INITIAL AUTHENTICATION CHECK
  // =========================================================

  useEffect(() => {

    let mounted = true;


    const initializeAuth = async () => {

      try {

        console.log(
          'Checking authentication...'
        );


        const {
          data: { session },
          error
        } = await supabase.auth.getSession();


        if (!mounted) {
          return;
        }


        if (error) {

          console.error(
            'Authentication check error:',
            error
          );

          setUser(null);

          clearApplicationData();

          return;
        }


        // ===================================================
        // NO LOGGED-IN USER
        // ===================================================

        if (!session?.user) {

          console.log(
            'No authenticated user.'
          );

          setUser(null);

          clearApplicationData();

          return;
        }


        // ===================================================
        // LOGGED-IN USER
        // ===================================================

        console.log(
          'Authenticated user:',
          session.user.email
        );


        try {

          const profile =
            await authService.getCurrentUser();


          if (!mounted) {
            return;
          }


          setUser({
            ...profile,
            isLoggedIn: true
          });


        } catch (profileError) {

          console.error(
            'Failed to load user profile:',
            profileError
          );


          if (!mounted) {
            return;
          }


          // Still allow application to open
          // if profile loading fails.

          setUser({

            id: session.user.id,

            email: session.user.email,

            name: '',

            title: '',

            college: '',

            phone: '',

            isLoggedIn: true

          });

        }


        // ===================================================
        // LOAD APPLICATION DATA
        // ===================================================

        if (mounted) {

          await refreshAppData();

        }


      } catch (error) {

        console.error(
          'Authentication initialization error:',
          error
        );


        if (mounted) {

          setUser(null);

          clearApplicationData();

        }


      } finally {

        if (mounted) {

          console.log(
            'Authentication check completed.'
          );

          setLoading(false);

        }

      }

    };


    initializeAuth();


    // =======================================================
    // SUPABASE AUTH STATE LISTENER
    // =======================================================

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(
      (event, session) => {

        if (!mounted) {
          return;
        }


        console.log(
          'Auth event:',
          event
        );


        // ===================================================
        // SIGNED OUT
        // ===================================================

        if (
          event === 'SIGNED_OUT' ||
          !session?.user
        ) {

          setUser(null);

          clearApplicationData();

          setLoading(false);

          return;
        }


        // ===================================================
        // AUTHENTICATED EVENTS
        // ===================================================

        if (
          event === 'SIGNED_IN' ||
          event === 'TOKEN_REFRESHED' ||
          event === 'USER_UPDATED'
        ) {

          setUser((previousUser) => {

            if (previousUser) {

              return previousUser;

            }


            return {

              id: session.user.id,

              email: session.user.email,

              name: '',

              title: '',

              college: '',

              phone: '',

              isLoggedIn: true

            };

          });


          setLoading(false);

        }

      }
    );


    return () => {

      mounted = false;

      subscription.unsubscribe();

    };

  }, [
    clearApplicationData,
    refreshAppData
  ]);


  // =========================================================
  // ACTIVE REMINDER
  // =========================================================

  useEffect(() => {

    if (
      !user ||
      followUps.length === 0 ||
      sessionStorage.getItem(
        'gv_reminder_shown'
      )
    ) {

      return;

    }


    const topFollowUp =
      followUps.find(
        (followUp) =>
          followUp.status === 'Pending'
      );


    if (!topFollowUp) {
      return;
    }


    // Find actual HR

    const hr =
      hrs.find(
        (item) =>
          item.id === topFollowUp.hrId
      );


    // Do not use fake HR information

    if (!hr) {
      return;
    }


    setActiveReminder({

      followUp: topFollowUp,

      hr

    });


    sessionStorage.setItem(
      'gv_reminder_shown',
      'true'
    );


  }, [
    followUps,
    hrs,
    user
  ]);


  // =========================================================
  // LOGIN
  // =========================================================

  const login = async (
    email,
    password
  ) => {

    try {

      setLoading(true);


      const response =
        await authService.login(
          email,
          password
        );


      const profile =
        await authService.getCurrentUser();


      setUser({

        ...profile,

        isLoggedIn: true

      });


      showToast(
        'Welcome back, Placement Officer! 👋'
      );


      await refreshAppData();


      return {

        ...response,

        user: profile

      };


    } catch (error) {

      console.error(
        'Login error:',
        error
      );


      const message =
        error?.message ||
        'Login failed. Please check your credentials.';


      showToast(
        message,
        'error'
      );


      throw error;


    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // SIGNUP
  // =========================================================

  const signup = async (
    name,
    email,
    password,
    title,
    college,
    phone
  ) => {

    try {

      setLoading(true);


      const response =
        await authService.signup(
          name,
          email,
          password,
          title,
          college,
          phone
        );


      let profile;


      try {

        profile =
          await authService.getCurrentUser();


      } catch (profileError) {

        console.error(
          'Signup profile loading error:',
          profileError
        );


        profile = {

          id: response.user?.id,

          name,

          email,

          title,

          college,

          phone

        };

      }


      setUser({

        ...profile,

        isLoggedIn: true

      });


      showToast(
        'Account created successfully! 🎉'
      );


      await refreshAppData();


      return {

        ...response,

        user: profile

      };


    } catch (error) {

      console.error(
        'Signup error:',
        error
      );


      const message =
        error?.message ||
        'Account creation failed.';


      showToast(
        message,
        'error'
      );


      throw error;


    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = async () => {

    try {

      await authService.logout();


      setUser(null);


      clearApplicationData();


      sessionStorage.removeItem(
        'gv_reminder_shown'
      );


      showToast(
        'Logged out successfully.',
        'info'
      );


    } catch (error) {

      console.error(
        'Logout error:',
        error
      );


      showToast(
        'Logout failed.',
        'error'
      );

    }

  };


  // =========================================================
  // ADD HR CONTACT
  // =========================================================

  const addHR = async (
    newHRData
  ) => {

    try {

      setLoading(true);


      console.log(
        'Adding HR contact:',
        newHRData
      );


      const createdHR =
        await hrService.create(
          newHRData
        );


      if (!createdHR) {

        throw new Error(
          'HR contact was not created.'
        );

      }


      setHrs(
        (previousHRs) => [

          createdHR,

          ...previousHRs

        ]
      );


      showToast(
        `✓ HR Contact "${createdHR.name}" added successfully!`
      );


      return createdHR;


    } catch (error) {

      console.error(
        'Add HR error:',
        error
      );


      const message =
        error?.message ||
        'Failed to save HR Contact.';


      showToast(
        message,
        'error'
      );


      throw error;


    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // UPDATE HR CONTACT
  // =========================================================

  const updateHR = async (
    hrId,
    updatedHRData
  ) => {

    try {

      setLoading(true);


      console.log(
        'Updating HR contact:',
        hrId,
        updatedHRData
      );


      const updatedHR =
        await hrService.update(
          hrId,
          updatedHRData
        );


      if (!updatedHR) {

        throw new Error(
          'HR contact was not updated.'
        );

      }


      // Immediately update the HR card
      // without requiring page refresh.

      setHrs(
        (previousHRs) =>
          previousHRs.map((hr) =>
            hr.id === hrId
              ? updatedHR
              : hr
          )
      );


      showToast(
        `✓ HR Contact "${updatedHR.name}" updated successfully!`
      );


      return updatedHR;


    } catch (error) {

      console.error(
        'Update HR error:',
        error
      );


      const message =
        error?.message ||
        'Failed to update HR Contact.';


      showToast(
        message,
        'error'
      );


      throw error;


    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // ADD INTERACTION
  // =========================================================

  const addInteraction = async (
    interactionData
  ) => {

    try {

      setLoading(true);


      const createdInteraction =
        await interactionService.create(
          interactionData
        );


      showToast(
        '✓ Interaction saved successfully.'
      );


      await refreshAppData();


      return createdInteraction;


    } catch (error) {

      console.error(
        'Add interaction error:',
        error
      );


      showToast(
        error?.message ||
        'Failed to log interaction.',
        'error'
      );


      throw error;


    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // SCHEDULE FOLLOW-UP
  // =========================================================

  const scheduleFollowUp = async (
    followUpData
  ) => {

    try {

      setLoading(true);


      const createdFollowUp =
        await followUpService.create(
          followUpData
        );


      showToast(
        '✓ Follow-up scheduled successfully.'
      );


      await refreshAppData();


      return createdFollowUp;


    } catch (error) {

      console.error(
        'Schedule follow-up error:',
        error
      );


      showToast(
        error?.message ||
        'Failed to schedule follow-up.',
        'error'
      );


      throw error;


    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // MARK FOLLOW-UP COMPLETE
  // =========================================================

  const markFollowUpComplete = async (
    followUpId
  ) => {

    try {

      setLoading(true);


      await followUpService.markCompleted(
        followUpId
      );


      showToast(
        '✓ Follow-up marked as completed.'
      );


      await refreshAppData();


    } catch (error) {

      console.error(
        'Complete follow-up error:',
        error
      );


      showToast(
        error?.message ||
        'Failed to update follow-up status.',
        'error'
      );


      throw error;


    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // RESCHEDULE FOLLOW-UP
  // =========================================================

  const rescheduleFollowUp = async (
    followUpId,
    newDate,
    newTime
  ) => {

    try {

      setLoading(true);


      await followUpService.reschedule(
        followUpId,
        newDate,
        newTime
      );


      showToast(
        `✓ Follow-up rescheduled to ${newDate}.`
      );


      await refreshAppData();


    } catch (error) {

      console.error(
        'Reschedule follow-up error:',
        error
      );


      showToast(
        error?.message ||
        'Failed to reschedule follow-up.',
        'error'
      );


      throw error;


    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // ADD COMPANY
  // =========================================================

  const addCompany = async (
    companyData
  ) => {

    try {

      setLoading(true);


      const createdCompany =
        await companyService.create(
          companyData
        );


      showToast(
        `✓ Company "${createdCompany.name}" added successfully.`
      );


      await refreshAppData();


      return createdCompany;


    } catch (error) {

      console.error(
        'Add company error:',
        error
      );


      showToast(
        error?.message ||
        'Failed to save company.',
        'error'
      );


      throw error;


    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // PROVIDER
  // =========================================================

  return (

    <AppContext.Provider
      value={{

        // ===================================================
        // USER
        // ===================================================

        user,


        // ===================================================
        // APPLICATION DATA
        // ===================================================

        hrs,

        // Expose setHrs so HRContacts.jsx
        // can immediately remove/update HRs.

        setHrs,

        companies,

        interactions,

        followUps,

        notifications,


        // ===================================================
        // LOADING
        // ===================================================

        loading,


        // ===================================================
        // REMINDER
        // ===================================================

        activeReminder,

        setActiveReminder,


        // ===================================================
        // TOAST
        // ===================================================

        toast,

        showToast,


        // ===================================================
        // QUICK ADD
        // ===================================================

        isQuickAddOpen,

        setIsQuickAddOpen,


        // ===================================================
        // MODAL
        // ===================================================

        activeModal,

        setActiveModal,


        // ===================================================
        // AUTH
        // ===================================================

        login,

        signup,

        logout,


        // ===================================================
        // HR
        // ===================================================

        addHR,

        updateHR,


        // ===================================================
        // OTHER DATA
        // ===================================================

        addInteraction,

        scheduleFollowUp,

        markFollowUpComplete,

        rescheduleFollowUp,

        addCompany,


        // ===================================================
        // REFRESH
        // ===================================================

        refreshAppData

      }}
    >

      {children}

    </AppContext.Provider>

  );

};


// ===========================================================
// USE APP HOOK
// ===========================================================

export const useApp = () =>
  useContext(AppContext);