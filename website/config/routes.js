/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝
  'GET /': {
    action: 'view-homepage-or-redirect',
    locals: { isHomepage: true }
  },

  'GET /company/contact': {
    action: 'view-contact',
    locals: {
      pageTitleForMeta: 'Contact us | Fleet for osquery',
      pageDescriptionForMeta: 'Get in touch with our team.'
    }
  },

  // 'GET /get-started': {
  //   action: 'view-get-started' ,
  //   locals: {
  //     currentPage: 'get started',
  //     pageTitleForMeta: 'Get started | Fleet for osquery',
  //     pageDescriptionForMeta: 'Learn about getting started with Fleet.'
  //   }
  // },

  'GET /pricing': {
    action: 'view-pricing',
    locals: {
      currentPage: 'pricing',
      pageTitleForMeta: 'Pricing | Fleet for osquery',
      pageDescriptionForMeta: 'View Fleet plans and pricing details.'
    }
  },

  'GET /logos': {
    action: 'view-press-kit',
    locals: {
      pageTitleForMeta: 'Logos | Fleet for osquery',
      pageDescriptionForMeta: 'Download Fleet logos, wallpapers, and screenshots.'
    }
  },

  'GET /queries': {
    action: 'view-query-library',
    locals: {
      currentPage: 'queries',
      pageTitleForMeta: 'Queries | Fleet for osquery',
      pageDescriptionForMeta: 'A growing collection of useful queries for organizations deploying Fleet and osquery.'
    }
  },

  'GET /queries/:slug': {
    action: 'view-query-detail',
    locals: {
      currentPage: 'queries',
    }
  },

  'r|/((device-management|securing|releases|engineering|guides|announcements|use-cases|podcasts)/(.+))$|': {
    skipAssets: false,
    action: 'articles/view-basic-article',
    locals: {
      currentPage: 'articles',
    }
  },// handles /device-management/foo, /securing/foo, /releases/foo, /engineering/foo, /guides/foo, /announcements/foo, /use-cases/foo

  'r|^/((device-management|securing|releases|engineering|guides|announcements|use-cases|articles|podcasts))/*$|category': {
    skipAssets: false,
    action: 'articles/view-articles',
    locals: {
      currentPage: 'articles',
    }
  },// Handles the article landing page /articles, and the article cateogry pages (e.g. /device-management, /securing, /releases, etc)

  'GET /docs/?*': {
    skipAssets: false,
    action: 'docs/view-basic-documentation',
    locals: {
      currentPage: 'docs',
    }
  },// handles /docs and /docs/foo/bar

  'GET /handbook/?*':  {
    skipAssets: false,
    action: 'handbook/view-basic-handbook',
  },// handles /handbook and /handbook/foo/bar

  'GET /transparency': {
    action: 'view-transparency',
    locals: {
      pageTitleForMeta: 'Transparency | Fleet for osquery',
      pageDescriptionForMeta: 'Learn what data osquery can see.',
    }
  },
  'GET /customers/new-license': {
    action: 'customers/view-new-license',
    locals: {
      layout: 'layouts/layout-customer',
      pageTitleForMeta: 'Get Fleet Premium | Fleet for osquery',
      pageDescriptionForMeta: 'Generate your quote and start using Fleet Premium today.',
    }
  },
  'GET /customers/register': {
    action: 'entrance/view-signup',
    locals: {
      layout: 'layouts/layout-customer',
      pageTitleForMeta: 'Sign up | Fleet for osquery',
      pageDescriptionForMeta: 'Sign up for a Fleet Premium license.',
    }
  },
  'GET /customers/login': {
    action: 'entrance/view-login',
    locals: {
      layout: 'layouts/layout-customer',
      pageTitleForMeta: 'Log in | Fleet for osquery',
      pageDescriptionForMeta: 'Log in to the Fleet customer portal.',
    }
  },
  'GET /customers/dashboard': {
    action: 'customers/view-dashboard',
    locals: {
      layout: 'layouts/layout-customer',
      pageTitleForMeta: 'Customer dashboard | Fleet for osquery',
      pageDescriptionForMeta: 'View and edit information about your Fleet Premium license.',
    }
  },
  'GET /customers/forgot-password': {
    action: 'entrance/view-forgot-password',
    locals: {
      layout: 'layouts/layout-customer',
      pageTitleForMeta: 'Forgot password | Fleet for osquery',
      pageDescriptionForMeta: 'Recover the password for your Fleet customer account.',
    }
  },
  'GET /customers/new-password': {
    action: 'entrance/view-new-password',
    locals: {
      layout: 'layouts/layout-customer',
      pageTitleForMeta: 'New password | Fleet for osquery',
      pageDescriptionForMeta: 'Change the password for your Fleet customer account.',
    }
  },

  'GET /platform': {
    action: 'view-platform',
    locals: {
      currentPage: 'platform',
      pageTitleForMeta: 'Platform | Fleet for osquery',
      pageDescriptionForMeta: 'Learn about the Fleet\'s features.',
    }
  },

  'GET /g': {
    action: 'view-landing',
    locals: {
      layout: 'layouts/layout-landing',
      currentPage: 'landing',
    }
  },

  'GET /reports/state-of-device-management': {
    action: 'reports/view-state-of-device-management',
    locals: {
      pageTitleForMeta: 'State of device management | Fleet for osquery',
      pageDescriptionForMeta: 'We surveyed 200+ security practitioners to discover the state of device management in 2022. Click here to learn about their struggles and best practices.',
      headerCTAHidden: true,
    }
  },
  
  'GET /overview': {
    action: 'view-sales-one-pager',
    locals: {
      pageTitleForMeta: 'Overview | Fleet for osquery',
      pageDescriptionForMeta: 'Fleet helps security and IT teams protect their devices. We\'re the single source of truth for workstation and server telemetry. Click to learn more!',
      layout: 'layouts/layout-landing'
    },
  },

  'GET /try-fleet/register': {
    action: 'try-fleet/view-register',
    locals: {
      layout: 'layouts/layout-sandbox',
    }
  },

  'GET /try-fleet/login': {
    action: 'try-fleet/view-sandbox-login',
    locals: {
      layout: 'layouts/layout-sandbox',
    }
  },

  'GET /try-fleet/sandbox': {
    action: 'try-fleet/view-sandbox-or-redirect',
    locals: {
      layout: 'layouts/layout-sandbox',
    },
  },

  'GET /try-fleet/forgot-password': {
    action: 'entrance/view-forgot-password',
    locals: {
      layout: 'layouts/layout-customer',
      pageTitleForMeta: 'Forgot password | Fleet for osquery',
      pageDescriptionForMeta: 'Recover the password for your Fleet account.',
    }
  },

  'GET /try-fleet/new-password': {
    action: 'entrance/view-new-password',
    locals: {
      layout: 'layouts/layout-customer',
      pageTitleForMeta: 'New password | Fleet for osquery',
      pageDescriptionForMeta: 'Change the password for your Fleet account.',
    }
  },

  //  ╦  ╔═╗╔═╗╔═╗╔═╗╦ ╦  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗
  //  ║  ║╣ ║ ╦╠═╣║  ╚╦╝  ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗
  //  ╩═╝╚═╝╚═╝╩ ╩╚═╝ ╩   ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝
  //  ┌─  ┌─┐┌─┐┬─┐  ┌┐ ┌─┐┌─┐┬┌─┬ ┬┌─┐┬─┐┌┬┐┌─┐  ┌─┐┌─┐┌┬┐┌─┐┌─┐┌┬┐  ─┐
  //  │   ├┤ │ │├┬┘  ├┴┐├─┤│  ├┴┐│││├─┤├┬┘ ││└─┐  │  │ ││││├─┘├─┤ │    │
  //  └─  └  └─┘┴└─  └─┘┴ ┴└─┘┴ ┴└┴┘┴ ┴┴└──┴┘└─┘  └─┘└─┘┴ ┴┴  ┴ ┴ ┴o  ─┘
  // Add redirects here for deprecated/legacy links, so that they go to an appropriate new place instead of just being broken when pages move or get renamed.
  //
  // For example:
  // If we were going to change fleetdm.com/company/about to fleetdm.com/company/story, we might do something like:
  // ```
  // 'GET /company/about': '/company/story',
  // ```
  //
  // Or another example, if we were to rename a doc page:
  // ```
  // 'GET /docs/using-fleet/learn-how-to-use-fleet': '/docs/using-fleet/fleet-for-beginners',
  // ```
  'GET /try-fleet':                  '/get-started',
  'GET /docs/deploying/fleet-public-load-testing': '/docs/deploying/load-testing',
  'GET /handbook/customer-experience': '/handbook/customers',



  //  ╔╦╗╦╔═╗╔═╗  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗   ┬   ╔╦╗╔═╗╦ ╦╔╗╔╦  ╔═╗╔═╗╔╦╗╔═╗
  //  ║║║║╚═╗║    ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗  ┌┼─   ║║║ ║║║║║║║║  ║ ║╠═╣ ║║╚═╗
  //  ╩ ╩╩╚═╝╚═╝  ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝  └┘   ═╩╝╚═╝╚╩╝╝╚╝╩═╝╚═╝╩ ╩═╩╝╚═╝

  // Convenience
  // =============================================================================================================
  // Things that people are used to typing in to the URL and just randomly trying.
  //
  // For example, a clever user might try to visit fleetdm.com/documentation, not knowing that Fleet's website
  // puts this kind of thing under /docs, NOT /documentation.  These "convenience" redirects are to help them out.
  'GET /documentation':              '/docs',
  'GET /contribute':                 '/docs/contributing',
  'GET /install':                    '/get-started',
  'GET /company':                    '/company/about',
  'GET /company/about':              '/handbook', // FUTURE: brief "about" page explaining the origins of the company
  'GET /support':                    '/company/contact',
  'GET /contact':                    '/company/contact',
  'GET /legal':                      '/legal/terms',
  'GET /terms':                      '/legal/terms',
  'GET /handbook/security/github':   '/handbook/security#git-hub-security',
  'GET /login':                      '/customers/login',
  'GET /slack':                      (_, res) => { res.status(301).redirect('https://osquery.fleetdm.com/c/fleet'); },
  'GET /docs/using-fleet/updating-fleet': '/docs/deploying/upgrading-fleet',
  'GET /blog':                   '/articles',
  'GET /brand':                  '/logos',
  'GET /get-started':            '/try-fleet/register',

  // Sitemap
  // =============================================================================================================
  // This is for search engines, not humans.  Search engines know to visit fleetdm.com/sitemap.xml to download this
  // XML file, which helps search engines know which pages are available on the website.
  'GET /sitemap.xml':            { action: 'download-sitemap' },

  // Potential future pages
  // =============================================================================================================
  // Things that are not webpages here (in the Sails app) yet, but could be in the future.  For now they are just
  // redirects to somewhere else EXTERNAL to the Sails app.
  'GET /security':               'https://github.com/fleetdm/fleet/security/policy',
  'GET /trust':                  'https://app.vanta.com/fleet/trust/5i2ulsbd76k619q9leaoh0',
  'GET /hall-of-fame':           'https://github.com/fleetdm/fleet/pulse',
  'GET /apply':                  'https://fleet-device-management.breezy.hr',
  'GET /jobs':                   'https://fleet-device-management.breezy.hr',
  'GET /company/stewardship':    'https://github.com/fleetdm/fleet', // FUTURE: page about how we approach open source and our commitments to the community
  'GET /legal/terms':            'https://docs.google.com/document/d/1OM6YDVIs7bP8wg6iA3VG13X086r64tWDqBSRudG4a0Y/edit',
  'GET /legal/privacy':          'https://docs.google.com/document/d/17i_g1aGpnuSmlqj35-yHJiwj7WRrLdC_Typc1Yb7aBE/edit',
  'GET /logout':                 '/api/v1/account/logout',

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝
  'POST /api/v1/webhooks/receive-usage-analytics': { action: 'webhooks/receive-usage-analytics', csrf: false },
  '/api/v1/webhooks/github': { action: 'webhooks/receive-from-github', csrf: false },


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // Note that, in this app, these API endpoints may be accessed using the `Cloud.*()` methods
  // from the Parasails library, or by using those method names as the `action` in <ajax-form>.
  'POST /api/v1/deliver-contact-form-message':        { action: 'deliver-contact-form-message' },
  'POST /api/v1/entrance/send-password-recovery-email': { action: 'entrance/send-password-recovery-email' },
  'POST /api/v1/customers/signup':                     { action: 'entrance/signup' },
  'POST /api/v1/account/update-profile':               { action: 'account/update-profile' },
  'POST /api/v1/account/update-password':              { action: 'account/update-password' },
  'POST /api/v1/account/update-billing-card':          { action: 'account/update-billing-card'},
  'POST /api/v1/customers/login':                      { action: 'entrance/login' },
  '/api/v1/account/logout':                            { action: 'account/logout' },
  'POST /api/v1/customers/create-quote':               { action: 'customers/create-quote' },
  'POST /api/v1/customers/save-billing-info-and-subscribe': { action: 'customers/save-billing-info-and-subscribe' },
  'POST /api/v1/entrance/update-password-and-login':    { action: 'entrance/update-password-and-login' },
  'POST /api/v1/deliver-demo-signup':                   { action: 'deliver-demo-signup' },
  'POST /api/v1/try-fleet/provision-fleet-sandbox-for-existing-user': { action: 'try-fleet/provision-fleet-sandbox-for-existing-user' },
};
