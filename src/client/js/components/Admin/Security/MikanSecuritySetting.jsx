import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { createSubscribedElement } from '../../UnstatedUtils';
import { toastSuccess, toastError } from '../../../util/apiNotification';

import AppContainer from '../../../services/AppContainer';
import AdminGeneralSecurityContainer from '../../../services/AdminGeneralSecurityContainer';
import AdminMikanSecurityContainer from '../../../services/AdminMikanSecurityContainer';
import MikanAuthTestModal from './MikanAuthTestModal';


class MikanSecuritySetting extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isRetrieving: true,
      isMikanAuthTestModalShown: false,
    };

    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.openMikanAuthTestModal = this.openMikanAuthTestModal.bind(this);
    this.closeMikanAuthTestModal = this.closeMikanAuthTestModal.bind(this);
  }

  async componentDidMount() {
    const { adminMikanSecurityContainer } = this.props;

    try {
      await adminMikanSecurityContainer.retrieveSecurityData();
    }
    catch (err) {
      toastError(err);
    }
    this.setState({ isRetrieving: false });
  }

  async onClickSubmit() {
    const { t, adminMikanSecurityContainer, adminGeneralSecurityContainer } = this.props;

    try {
      await adminMikanSecurityContainer.updateMikanSetting();
      await adminGeneralSecurityContainer.retrieveSetupStratedies();
      toastSuccess(t('security_setting.mikan.updated_mikan'));
    }
    catch (err) {
      toastError(err);
    }
  }

  openMikanAuthTestModal() {
    this.setState({ isMikanAuthTestModalShown: true });
  }

  closeMikanAuthTestModal() {
    this.setState({ isMikanAuthTestModalShown: false });
  }

  render() {
    const { t, adminGeneralSecurityContainer, adminMikanSecurityContainer } = this.props;
    const { isMikanEnabled } = adminGeneralSecurityContainer.state;

    if (this.state.isRetrieving) {
      return null;
    }
    return (
      <React.Fragment>

        <h2 className="alert-anchor border-bottom">
          Mikan
        </h2>

        <div className="row mb-5">
          <div className="col-xs-3 my-3 text-right">
            <strong>Use Mikan</strong>
          </div>
          <div className="col-xs-6 text-left">
            <div className="checkbox checkbox-success">
              <input
                id="isMikanEnabled"
                type="checkbox"
                checked={isMikanEnabled}
                onChange={() => { adminGeneralSecurityContainer.switchIsMikanEnabled() }}
              />
              <label htmlFor="isMikanEnabled">
                {t('security_setting.mikan.enable_mikan')}
              </label>
            </div>
            {(!adminGeneralSecurityContainer.state.setupStrategies.includes('mikan') && isMikanEnabled)
              && <div className="label label-warning">{t('security_setting.setup_is_not_yet_complete')}</div>}
          </div>
        </div>


        {isMikanEnabled && (
          <React.Fragment>

            <h3 className="border-bottom">{t('security_setting.configuration')}</h3>

            <div className="row mb-5">
              <label htmlFor="mikanApiUrl" className="col-xs-3 control-label text-right">API URL</label>
              <div className="col-xs-6">
                <input
                  className="form-control"
                  type="text"
                  name="mikanApiUrl"
                  defaultValue={adminMikanSecurityContainer.state.mikanApiUrl || ''}
                  onChange={e => adminMikanSecurityContainer.changeMikanApiUrl(e.target.value)}
                />
                <small>
                  <p
                    className="help-block"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: t('security_setting.mikan.api_url_detail') }}
                  />
                  {t('security_setting.example')}: <code>https://api.mikan.example.com</code>
                </small>
              </div>
            </div>

            <div className="row mb-5">
              <label htmlFor="mikanLoginUrl" className="col-xs-3 control-label text-right">Login URL</label>
              <div className="col-xs-6">
                <input
                  className="form-control"
                  type="text"
                  name="mikanLoginUrl"
                  defaultValue={adminMikanSecurityContainer.state.mikanLoginUrl || ''}
                  onChange={e => adminMikanSecurityContainer.changeMikanLoginUrl(e.target.value)}
                />
                <small>
                  <p
                    className="help-block"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: t('security_setting.mikan.login_url_detail') }}
                  />
                  {t('security_setting.example')}: <code>https://mikan.example.com/login</code>
                </small>
              </div>
            </div>

            <div className="row mb-5">
              <label htmlFor="mikanCookieName" className="col-xs-3 control-label text-right">Cookie Name</label>
              <div className="col-xs-6">
                <input
                  className="form-control"
                  type="text"
                  name="mikanCookieName"
                  defaultValue={adminMikanSecurityContainer.state.mikanCookieName || ''}
                  onChange={e => adminMikanSecurityContainer.changeMikanCookieName(e.target.value)}
                />
                <small>
                  <p
                    className="help-block"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: t('security_setting.mikan.cookie_name_detail') }}
                  />
                </small>
              </div>
            </div>

            <div className="row my-3">
              <div className="col-xs-offset-3 col-xs-5">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={adminMikanSecurityContainer.state.retrieveError != null}
                  onClick={this.onClickSubmit}
                >
                  {t('Update')}
                </button>
                <button type="button" className="btn btn-default ml-2" onClick={this.openMikanAuthTestModal}>{t('security_setting.mikan.test_config')}</button>
              </div>
            </div>

          </React.Fragment>
        )}


        <MikanAuthTestModal isOpen={this.state.isMikanAuthTestModalShown} onClose={this.closeMikanAuthTestModal} />

      </React.Fragment>
    );
  }

}

MikanSecuritySetting.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  adminGeneralSecurityContainer: PropTypes.instanceOf(AdminGeneralSecurityContainer).isRequired,
  adminMikanSecurityContainer: PropTypes.instanceOf(AdminMikanSecurityContainer).isRequired,
};

const MikanSecuritySettingWrapper = (props) => {
  return createSubscribedElement(MikanSecuritySetting, props, [AppContainer, AdminGeneralSecurityContainer, AdminMikanSecurityContainer]);
};

export default withTranslation()(MikanSecuritySettingWrapper);