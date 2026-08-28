import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AtSign, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Form, FormField } from '@maincomponents/components/ui/form';
import { Button } from '@maincomponents/components/ui/button';
import PasswordInput from '@maincomponents/Inputs/PasswordInput';
import TextInput from '@maincomponents/Inputs/TextInput';
import ForgotPasswordPopup from '@maincomponents/modal/ForgotPasswordPopup';
import logo from '../../assets/sidebar/logo.png';

import { loginSchema } from '@validations/index';
import { signIn } from '@redux/slice/authSlice';
import { useAppTranslation } from '../../hooks/use-translation';

// A reusable SVG Wave component for the background
const Wave = ({ className, animationVariants }) => (
  <motion.svg
    className={`absolute w-[200%] h-auto ${className}`}
    viewBox="0 0 1440 320"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    variants={animationVariants}
    animate="animate"
  >
    <path d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,133.3C672,117,768,139,864,165.3C960,192,1056,224,1152,218.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
  </motion.svg>
);


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, isRTL } = useAppTranslation();

  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const { loading, error } = useSelector(state => state.auth);

  const form = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  const isSubmitting = form.formState.isSubmitting || loading;

  async function onSubmit(values) {
    try {
      await dispatch(signIn(values)).unwrap();
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
    }
  }

  const handleForgotPassword = async ({ email, userId }) => {
    setForgotPasswordLoading(true);
    setTimeout(() => {
      setForgotPasswordLoading(false);
      setForgotPasswordOpen(false);
    }, 1500);
  };
  
  const formContainerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2, type: 'spring', stiffness: 100 } },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const waveAnimations = {
      wave1: { animate: { x: [0, 50, 0], y: [0, -20, 0], transition: { duration: 40, repeat: Infinity, ease: 'easeInOut' } } },
      wave2: { animate: { x: [0, -40, 0], y: [0, 30, 0], transition: { duration: 35, repeat: Infinity, ease: 'easeInOut' } } },
      wave3: { animate: { x: [0, 30, 0], y: [0, -15, 0], transition: { duration: 30, repeat: Infinity, ease: 'easeInOut' } } },
  }

  return (
    <>
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-950" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Fullscreen Animated Waves Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
            <Wave className="bottom-0 -left-1/2 fill-blue-300/50 dark:fill-blue-900/40" animationVariants={waveAnimations.wave1} />
            <Wave className="bottom-0 -left-1/2 fill-purple-300/40 dark:fill-purple-900/30" animationVariants={waveAnimations.wave2} />
            <Wave className="bottom-0 -left-1/2 fill-teal-300/40 dark:fill-teal-900/50" animationVariants={waveAnimations.wave3} />

            {/* Gradient overlays to hide the hard edges */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 dark:from-gray-950 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-gray-100 dark:from-gray-950 via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* Centered Frosted Glass Form */}
        <motion.div
            className="relative z-10 w-full max-w-md p-4"
            variants={formContainerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="rounded-2xl border border-white/20 dark:border-white/10 bg-white/60 dark:bg-black/40 shadow-2xl backdrop-blur-xl p-8">
              {/* Header */}
              <motion.div className="mb-8 text-center" variants={itemVariants}>
                  <img src={logo} alt="LMS Logo" className="mx-auto mb-4 h-14 w-14 rounded-lg" />
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                      {t('login.welcomeBack', 'Welcome Back')}
                  </h1>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                      {t('login.signInToContinue', 'Sign in to continue')}
                  </p>
              </motion.div>

              {error && (
                <motion.div
                  className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-sm font-medium text-red-700 dark:text-red-400"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <TextInput
                          label={t('login.email')}
                          placeHolder={t('login.emailPlaceholder')}
                          type="email"
                          Icon={AtSign}
                          field={field}
                          fieldState={fieldState}
                          isRTL={isRTL}
                        />
                      )}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field, fieldState }) => (
                        <PasswordInput
                          label={t('login.password')}
                          placeHolder={t('login.passwordPlaceholder')}
                          field={field}
                          fieldState={fieldState}
                          isRTL={isRTL}
                        />
                      )}
                    />
                  </motion.div>
                  <motion.div className="flex items-center justify-between text-sm" variants={itemVariants}>
                    <div className="flex items-center gap-2">
                        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-400 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-transparent" />
                        <label htmlFor="remember-me" className="select-none text-gray-700 dark:text-gray-300">{t('login.rememberMe')}</label>
                    </div>
                    <button type="button" onClick={() => setForgotPasswordOpen(true)} className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">{t('login.forgotPassword')}?</button>
                  </motion.div>
                  <motion.div className="pt-4" variants={itemVariants}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 text-base font-bold text-white bg-blue-600 shadow-md shadow-blue-500/20 transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-blue-500/50 disabled:opacity-60 group"
                    >
                      <div className="relative flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                              <User size={20} />
                            </motion.div>
                            <span>{t('login.signingIn')}...</span>
                          </>
                        ) : (
                          <>
                            <span>{t('login.signIn')}</span>
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </div>
                    </Button>
                  </motion.div>
                </form>
              </Form>
              <motion.div className="flex items-center justify-center gap-2 pt-8 text-xs text-gray-600 dark:text-gray-400" variants={itemVariants}>
                  <ShieldCheck size={14} />
                  <span>{t('login.secureLogin')}</span>
              </motion.div>
            </div>
        </motion.div>
      </div>
      
      <ForgotPasswordPopup
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        onSubmit={handleForgotPassword}
        loading={forgotPasswordLoading}
      />
    </>
  );
};

export default Login;