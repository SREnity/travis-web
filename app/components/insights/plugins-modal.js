import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import { task } from 'ember-concurrency';

const NEW_INSIGHTS_PLUGIN_TYPES = [
  { id: 'aws', name: 'AWS Infrastructure' },
  { id: 'sre', name: 'Travis Insights' },
  { id: 'circleci', name: 'CircleCI' },
  { id: 'cloudwatch', name: 'AWS CloudWatch Monitoring' },
  { id: 'datadog', name: 'DataDog Monitoring' },
  { id: 'kube', name: 'Kubernetes Cluster' },
  { id: 'github', name: 'GitHub' },
  { id: 'pingdom', name: 'Pingdom Uptime Monitoring' },
  { id: 'gcp', name: 'GCP Infrastructure' },
  { id: 'gcs', name: 'Google Cloud Source Repositories' },
  { id: 'gitlab', name: 'Gitlab' },
  { id: 'bitbucket', name: 'Bitbucket' },
  { id: 'cloudflare', name: 'Cloudflare' },
  { id: 'assembla', name: 'Assembla' },
  { id: 'dyn', name: 'DynECT' },
  { id: 'heroku', name: 'Heroku' },
  { id: 'newrelic', name: 'NewRelic' },
  { id: 'okta', name: 'Okta' },
  { id: 'pagerduty', name: 'PagerDuty' },
  { id: 'rollbar', name: 'Rollbar' },
  { id: 'sentry', name: 'Sentry' },
  { id: 'sysdig', name: 'Sysdig' },
  { id: 'teamcity', name: 'TeamCity' },
  { id: 'travisci', name: 'Travis CI' },
  { id: 'buddyci', name: 'Buddy CI' },
  { id: 'sonarqube', name: 'Sonarqube' },
  { id: 'bamboo', name: 'Bamboo CI' },
  { id: 'cloudbees', name: 'Cloudbees' },
  { id: 'zendesk', name: 'Zendesk' },
  { id: 'godaddy', name: 'GoDaddy' },
  { id: 'codeclimate', name: 'CodeClimate' },
  { id: 'appdynamics', name: 'AppDynamics' },
  { id: 'artifactory', name: 'Artifactory' },
  { id: 'azure_devops', name: 'Azure DevOps' },
  { id: 'application_insights', name: 'Azure Application Insights' },
  { id: 'onelogin', name: 'OneLogin' },
  { id: 'azure', name: 'Azure' }
];

const NEW_INSIGHTS_PLUGIN_HELP_TEXT = {
  'aws': ['Where do I find my key?', '<p>Follow the "Creating IAM Users (Console)" guide found here: <a target="_blank" href="http://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console" >Creating a User in AWS</a></p><p>Create a new user with the "Programmatic access" checkbox selected and then attach the existing "ReadOnlyAccess" IAM policy.</p>'],
  'sre': ['Where do I find my key?', '<p>If you have deleted your default Travis Insights key, please contact support at #{SUPPORT_EMAIL}.</p>'],
  'cloudwatch': ['Where do I find my key?', '<p>Follow the "Creating IAM Users (Console)" guide found here: <a target="_blank" href="http://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html#id_users_create_console">Creating a User in AWS</a></p><p>Create a new user with the "Programmatic access" checkbox selected and then attach the existing "ReadOnlyAccess" IAM policy.</p>'],
  'datadog': ['Where do I find my key?', '<p>Follow the steps here to create an API and application key here: <a target="_blank" href="https://app.datadoghq.com/account/settings#api">DataDog Authentication</a></p>'],
  'kube': ['How do I generate my key?', "<p>Follow the steps here to deploy the kubernetes agent on your cluster: <a target=\"_blank\" href=\"https://github.com/SREnity/kube-agent\">GitHub</a></p><p>Don't forget to save your generated public and private keys for adding to your deployment YAML.</p>"],
  'github': ['Where do I find my Access Token?', '<p>Follow the steps here to generate a personal access token: <a target="_blank" href="https://github.com/settings/tokens">Personal Access Tokens</a></p><p>The permissions you currently need to grant to this token are: repo, read:org, read:repo_hook, read:user, and user:email.</p>'],
  'pingdom': ['Where do I find my key?', '<p>Generate an API token here: <a target="_blank" href="https://my.pingdom.com/app/api-tokens">Pingdom API tokens</a></p><p>You should ideally create a new user account that is <em>ONLY</em> used for this integration.</p>'],
  'gcp': [
    'Where do I find my key?',
    '<p>Generate a new key for the user or create a new user under IAM & Admin > Service Accounts in Google Console</p>'
  ],
  'gcs': [
    'Where do I find my key?',
    '<p>Generate a new key for the user or create a new user under IAM & Admin > Service Accounts in Google Console</p>'
  ],
  'circleci': ['Where do I find my key?', '<p>Generate an API token here: <a target="_blank" href="https://circleci.com/account/api">CircleCI API tokens</a></p>'],
  'cloudflare': ['Where do I find my key?', '<p>Generate an API token here: <a target="_blank" href="https://dash.cloudflare.com/profile/api-tokens">Cloudflare API tokens</a></p>'],
  'assembla': ['Where do I find my key?', '<p>Generate an API token here: <a target="_blank" href="https://app.assembla.com/user/edit/manage_clients">Assembla API tokens</a></p>'],
  'dyn': ['', '<p>Use your username and password</p>'],
  'heroku': ['Where do I find my key?', '<p>Generate an API authorization here: <a target="_blank" href="https://dashboard.heroku.com/account/applications">Heroku API applications</a></p>'],
  'newrelic': ['Where do I find my key?', '<p>Generate an API key under Integrations > API keys in your account settings</p>'],
  'okta': ['Where do I find my key?', '<p>Generate an API token under Security > API > Tokens in your account</p>'],
  'pagerduty': ['Where do I find my key?', '<p>Generate an API key under Configuration > API access in your account</p>'],
  'rollbar': ['Where do I find my key?', '<p>Find your access token in project settings</p>'],
  'sentry': ['Where do I find my token?', '<p>Generate an auth token here: <a target="_blank" href="https://sentry.io/settings/account/api/auth-tokens/">Sentry auth tokens</a></p>'],
  'sysdig': ['Where do I find my token?', '<p>Find your auth token here: <a target="_blank" href="https://secure.sysdig.com/#/settings/user">Sysdig user settings</a></p>'],
  'teamcity': ['Where do I find my token?', '<p>Generate an API token under My Settings & Tools > Access Tokens in your account</p>'],
  'travisci': ['Where do I find my token?', '<p>Find your API token here: <a target="_blank" href="https://travis-ci.com/account/preferences">Travis CI Account Settings</a></p>'],
  'gitlab': [
    'Where do I find my token?',
    '<p>Generate an API token under User Settings > Access Tokens in your Gitlab instance or in gitlab.com</p>'
  ],
  'buddyci': ['Where do I find my token?', '<p>Generate an API token here: <a target="_blank" href="https://app.buddy.works/api-tokens">Buddy CI API Tokens</a></p>'],
  'sonarqube': ['Where do I find my token?', '<p>Generate an API key under My Account > Security > Tokens in your instance</p>'],
  'bamboo': ['', '<p>Use your username and password</p>'],
  'cloudbees': ['Where do I find my token?', '<p>Generate an API token under /me/configure in your Cloudbees instance</p>'],
  'zendesk': [
    'Where do I find my token?',
    '<p>Generate an API token under Admin > Channels > API in your Zendesk instance. Do not forget to enable Token Access in the same page</p>'
  ],
  'godaddy': ['Where do I find my key?', '<p>Generate an API key/secret pair here: <a target="_blank" href="https://developer.godaddy.com/keys">GoDaddy API Keys</a></p>'],
  'codeclimate': ['Where do I find my token?', '<p>Generate an API token here: <a target="_blank" href="https://codeclimate.com/profile/tokens">CodeClimate API Keys</a></p>'],
  'appdynamics': [
    'Where do I find my key?',
    '<p>Create an API client, then generate a temporary access token under Settings > Administration in your AppDynamics instance.</p>'
  ],
  'artifactory': ['Where do I find my key?', '<p>Generate an access token under Edit Profile in your Artifactory instance.</p>'],
  'azure_devops': [
    'Where do I find my token?',
    '<p>Generate an access token under Personal Access Token section in your Azure DevOps organization.</p>'
  ],
  'application_insights': [
    'Where do I find my API key?',
    '<p>Generate an access token under Configure > API access in your Azure Application Insights app.</p>'
  ],
  'onelogin': ['Where do I find my API credential pair?', '<p>Generate an API credential pair under Developers > API credentials in OneLogin.</p>'],
  'azure': [
    'Where do I find the needed data?',
    '<p>Generate a Security Principal using az CLI tool: az ad sp create-for-rbac --name "Travis Insights", then save response data</p>'
  ],
  'bitbucket': ['<a href="https://support.atlassian.com/bitbucket-cloud/docs/app-passwords" target="_blank"> Where do i find my App passwords?</a>', '']
};

const NEW_INSIGHTS_EXTERNAL_PLUGINS = [
  'kube'
];

const NEW_INSIGHTS_THREE_PART_PLUGINS = [
  'pingdom'
];

const NEW_INSIGHTS_URL_PLUGINS = [
  'bamboo', 'appdynamics', 'cloudbees', 'zendesk', 'gitlab',
  'artifactory', 'azure_devops', 'azure'
];

const NEW_INSIGHTS_PUBLIC_KEY_PLUGINS = [
  'aws', 'sre', 'cloudwatch', 'datadog', 'github', 'bamboo',
  'cloudbees', 'zendesk', 'sonarqube', 'godaddy', 'bitbucket',
  'assembla', 'dyn', 'azure_devops', 'application_insights',
  'okta', 'onelogin', 'azure', 'teamcity'
];

const NEW_INSIGHTS_PUBLIC_KEY_LABELS = {
  'aws': ['Public ID', 'This is the public id of Plugin', 'Enter Your AWS Public Key'],
  'circleci': ['API Token', 'This is the API token of Plugin', 'Enter Your CircleCI Personal API Token'],
  'cloudflare': ['API Token', 'This is the API token of Plugin', 'Enter Your Cloudflare API Token'],
  'codeclimate': ['API Token', 'This is the API token of Plugin', 'Enter Your CodeClimate API Token'],
  'sre': ['Public Key', 'This is the public key of Plugin', 'Enter Your Travis Insights Public Key'],
  'cloudwatch': ['Public ID', 'This is the public id of Plugin', 'Enter Your AWS CloudWatch Public ID'],
  'datadog': ['API Key', 'This is the API key of Plugin', 'Enter Your DataDog API Key'],
  'github': ['Username', 'This is the username of Plugin', 'Enter Your GitHub Username'],
  'bamboo': ['Username', 'This is the username of Plugin', 'Enter Your Bamboo CI Username'],
  'cloudbees': ['Username', 'This is the username of Plugin', 'Enter Your Cloudbees Username'],
  'zendesk': ['Email', 'This is the email of Plugin', 'Enter Your Zendesk Email'],
  'sonarqube': ['Sonarqube domain', 'This is the email of Plugin', 'Sonarqube domain'],
  'godaddy': ['API Key', 'This is the API key of Plugin', 'GoDaddy API key'],
  'bitbucket': ['Username', 'This is the username of Plugin', 'Enter Your Bitbucket Username'],
  'assembla': ['API Key', 'This is the API key of Plugin', 'Enter Your Assembla API key'],
  'dyn': ['Username', 'This is the username of Plugin', 'Enter Your Dyn Username'],
  'azure_devops': ['Username', 'This is the username of Plugin', 'Enter Your Azure Devops username'],
  'application_insights': ['Application ID', 'This is the application id of Plugin', 'Enter Your Azure Application Insights App ID'],
  'okta': ['Subdomain', 'This is the subdomain of Plugin', 'Enter Your Okta Subdomain'],
  'onelogin': ['API Key', 'This is the API key of Plugin', 'Enter Your OneLogin API key'],
  'azure': ['Application ID', 'This is the application id of Plugin', 'Enter Your Azure Service Principal Application ID'],
  'teamcity': ['URL', 'This is the URL of Plugin', 'Enter Your Teamcity instance URL'],
};

const NEW_INSIGHTS_PRIVATE_KEY_LABELS = {
  'aws': ['Private Key', '', 'Enter Your AWS Private Key'],
  'sre': ['Private Key', '', 'Enter Your Travis Insights Private Key'],
  'cloudwatch': ['Private Key', '', 'Enter Your AWS CloudWatch Private Key'],
  'datadog': ['Application Key', '', 'Enter Your Datadog Application Key'],
  'github': ['Personal Access Token', '', 'Enter Your GitHub Personal Access Token'],
  'bamboo': ['Password', '', 'Enter Your Bamboo CI Password'],
  'appdynamics': ['API token', '', 'Enter Your AppDynamics API token'],
  'cloudbees': ['API token', '', 'Enter Your Cloudbees API token'],
  'zendesk': ['API token', '', 'Enter Your Zendesk API token'],
  'pingdom': ['API token', '', 'Enter Your Pingdom API token'],
  'gcp': ['Service account private key', '', 'Paste the contents of the JSON key downloaded from Google Console'],
  'gcs': ['Service account private key', '', 'Paste the contents of the JSON key downloaded from Google Console'],
  'gitlab': ['Personal Access Token', '', 'Enter Your Personal Access Token'],
  'sonarqube': ['Personal Access Token', '', 'Enter Your Personal Access Token'],
  'buddyci': ['Personal Access Token', '', 'Enter Your Personal Access Token'],
  'godaddy': ['API secret', '', 'Enter Your GoDaddy API secret'],
  'bitbucket': ['App Password', '', 'Enter Your Bitbucket App Password'],
  'assembla': ['API secret', '', 'Enter Your Assembla API secret'],
  'dyn': ['Password', '', 'Enter Your Dyn Password'],
  'heroku': ['API Token', '', 'Enter Your Heroku API Token'],
  'artifactory': ['Access Token', '', 'Enter Your Artifactory Access Token'],
  'azure_devops': ['Personal Access Token', '', 'Enter Your Azure Devops Personal Access Token'],
  'application_insights': ['API key', '', 'Enter Your Azure Application Insights API key'],
  'newrelic': ['API key', '', 'Enter Your NewRelic API Key'],
  'okta': ['API key', '', 'Enter Your Okta API Key'],
  'pagerduty': ['API key', '', 'Enter Your PagerDuty API Key'],
  'rollbar': ['Access Token', '', 'Enter Your Rollbar Access Token'],
  'sentry': ['Auth Token', '', 'Enter Your Sentry Auth Token'],
  'onelogin': ['API Secret', '', 'Enter Your OneLogin API secret'],
  'azure': ['Password', '', 'Enter Your Azure Service Principal Password'],
  'sysdig': ['API Token', '', 'Enter Your Sysdig API Token'],
  'teamcity': ['API Token', '', 'Enter Your Teamcity API Token'],
  'travisci': ['API Token', '', 'Enter Your Travis CI API Token'],
};

const NEW_INSIGHTS_URL_LABELS = {
  'bamboo': ['URL', '', 'Enter Your Bamboo CI instance URL (i.e. https://bamboo.example.com)'],
  'appdynamics': ['Instance URL', '', 'Enter Your AppDynamics instance URL (i.e. https://appdynamics.example.com)'],
  'cloudbees': ['URL', '', 'Enter Your Cloudbees instance URL (i.e. https://cloudbees.example.com)'],
  'zendesk': ['Subdomain', '', 'Enter Your Zendesk instance URL (i.e. subdomain1 from https://subdomain1.zendesk.com)'],
  'gitlab': ['Gitlab domain', '', 'Gitlab domain'],
  'artifactory': ['Instance URL', '', 'Enter Your Artifactory instance URL (i.e. https://artifactory.example.com)'],
  'azure_devops': ['Organization name', '', 'Enter Your Azure DevOps organization name'],
  'azure': ['Tenant ID', '', 'Enter Your Azure Tenant ID'],
};

export default Component.extend({
  store: service(),
  flashes: service(),
  api: service(),

  pluginTypes: computed(() => NEW_INSIGHTS_PLUGIN_TYPES),

  selectedPlugin: NEW_INSIGHTS_PLUGIN_TYPES[0],

  pluginHelpTextHeader: computed('selectedPlugin', function () {
    return NEW_INSIGHTS_PLUGIN_HELP_TEXT[this.selectedPlugin.id][0];
  }),
  pluginHelpText: computed('selectedPlugin', function () {
    return NEW_INSIGHTS_PLUGIN_HELP_TEXT[this.selectedPlugin.id][1];
  }),

  pluginPublicKeyLabel: computed('selectedPlugin', function () {
    if (NEW_INSIGHTS_PUBLIC_KEY_LABELS[this.selectedPlugin.id]) {
      return NEW_INSIGHTS_PUBLIC_KEY_LABELS[this.selectedPlugin.id][0];
    } else {
      return 'Public Key';
    }
  }),
  pluginPublicKeyTooltip: computed('selectedPlugin', function () {
    if (NEW_INSIGHTS_PUBLIC_KEY_LABELS[this.selectedPlugin.id]) {
      return NEW_INSIGHTS_PUBLIC_KEY_LABELS[this.selectedPlugin.id][1];
    } else {
      return 'This is the public key of the plugin';
    }
  }),
  pluginPublicKeyPlaceholder: computed('selectedPlugin', function () {
    if (NEW_INSIGHTS_PUBLIC_KEY_LABELS[this.selectedPlugin.id]) {
      return NEW_INSIGHTS_PUBLIC_KEY_LABELS[this.selectedPlugin.id][2];
    } else {
      return 'Enter Your Public Key';
    }
  }),

  pluginPrivateKeyLabel: computed('selectedPlugin', function () {
    if (NEW_INSIGHTS_PRIVATE_KEY_LABELS[this.selectedPlugin.id]) {
      return NEW_INSIGHTS_PRIVATE_KEY_LABELS[this.selectedPlugin.id][0];
    } else {
      return 'Private Key';
    }
  }),
  pluginPrivateKeyTooltip: computed('selectedPlugin', function () {
    if (NEW_INSIGHTS_PRIVATE_KEY_LABELS[this.selectedPlugin.id]) {
      return NEW_INSIGHTS_PRIVATE_KEY_LABELS[this.selectedPlugin.id][1];
    } else {
      return 'This is the private key of the plugin';
    }
  }),
  pluginPrivateKeyPlaceholder: computed('selectedPlugin', function () {
    if (NEW_INSIGHTS_PRIVATE_KEY_LABELS[this.selectedPlugin.id]) {
      return NEW_INSIGHTS_PRIVATE_KEY_LABELS[this.selectedPlugin.id][2];
    } else {
      return 'Enter Your Private Key';
    }
  }),

  pluginUrlLabel: computed('selectedPlugin', function () {
    if (NEW_INSIGHTS_URL_LABELS[this.selectedPlugin.id]) {
      return NEW_INSIGHTS_URL_LABELS[this.selectedPlugin.id][0];
    } else {
      return 'Domain';
    }
  }),
  pluginUrlTooltip: computed('selectedPlugin', function () {
    if (NEW_INSIGHTS_URL_LABELS[this.selectedPlugin.id]) {
      return NEW_INSIGHTS_URL_LABELS[this.selectedPlugin.id][1];
    } else {
      return 'This is the domain of the plugin';
    }
  }),
  pluginUrlPlaceholder: computed('selectedPlugin', function () {
    if (NEW_INSIGHTS_URL_LABELS[this.selectedPlugin.id]) {
      return NEW_INSIGHTS_URL_LABELS[this.selectedPlugin.id][2];
    } else {
      return 'Enter Your Domain';
    }
  }),

  isExternalPlugin: computed('selectedPlugin', function () {
    return NEW_INSIGHTS_EXTERNAL_PLUGINS.includes(this.selectedPlugin.id);
  }),

  isThreePartPlugin: computed('selectedPlugin', function () {
    return NEW_INSIGHTS_THREE_PART_PLUGINS.includes(this.selectedPlugin.id);
  }),

  isUrlPlugin: computed('selectedPlugin', function () {
    return NEW_INSIGHTS_URL_PLUGINS.includes(this.selectedPlugin.id);
  }),

  pluginHasPublicKey: computed('selectedPlugin', function () {
    return NEW_INSIGHTS_PUBLIC_KEY_PLUGINS.includes(this.selectedPlugin.id);
  }),

  isTestRunning: reads('testConnection.isRunning'),
  isTestCompleted: false,
  isTestPassed: false,

  pluginName: '',
  publicKey: '',
  privateKey: '',
  accountName: '',
  appKey: '',
  domain: '',
  useForSubplugins: false,

  isFormValid: computed('pluginName', function () {
    return !!this.pluginName;
  }),

  save: task(function* () {
    try {
      yield this.store.createRecord('insights-plugin', {
        name: this.pluginName,
        publicKey: this.publicKey,
        privateKey: this.privateKey,
        pluginType: this.selectedPlugin.id
      }).save();
    } catch (error) {
      this.onClose();
      this.flashes.error('Unable to save plugin - please try again.');
    }
  }).drop(),

  testConnection: task(function* () {
    const keyHash = '';
    this.set('isTestCompleted', false);
    this.set('isTestPassed', false);
    this.set('testFailMessage', '');

    try {
      const res = yield this.api.patch('/insights_plugins/authenticate_key',  {
        data: {
          plugin_type: this.selectedPlugin.id,
          public_id: this.publicKey,
          private_key: this.privateKey,
          app_key: this.appKey,
          domain: this.domain,
          key_hash: keyHash
        }
      });
      this.set('isTestCompleted', true);
      if (res.success) {
        this.set('isTestPassed', true);
      } else {
        this.set('isTestPassed', false);
        this.set('testFailMessage', res.error_msg);
      }
    } catch (e) {
      this.set('isTestCompleted', true);
      this.set('isTestPassed', false);
      this.set('testFailMessage', e);
    }
  }),
});
