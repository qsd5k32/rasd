export default function ({ store, redirect,i18n }) {
  // If the user is authenticated
  if(store.$auth.loggedIn)
  {
    if(store.$auth.user.type != 'driver')
    {
      let locale = i18n.locale === i18n.defaultLocale ? '' : '/' + i18n.locale;
      redirect(locale + "/");
    }
  }
}
