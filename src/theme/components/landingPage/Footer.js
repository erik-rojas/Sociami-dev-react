import React from 'react';
import languageContent from './languageWiseContent';
import logoFooter from '../../../../assets/img/logo-footer.png'

export const Footer = (localeData) => {
    return (
      <footer className="footer">
        <a href="/" className="footer-logo">
          <img
            src={logoFooter}
            alt="logo"
            className="h-auto"
          />
        </a>
        <h3>{languageContent[localeData.currentLanguage].footer_header}</h3>
        <div className="new-subscribe"><input type="email" className="mail new-text" value="Mail" /></div>
        <button type="button" className="subscribe new-btn"><p>Subscribe</p></button>
        <ul className="info-list">
          <li>{languageContent[localeData.currentLanguage].footer_about}</li>
          <li>{languageContent[localeData.currentLanguage].footer_support}</li>
          <li>{languageContent[localeData.currentLanguage].footer_contact}</li>
          <li>{languageContent[localeData.currentLanguage].footer_press}</li>
        </ul>
        <h4 dangerouslySetInnerHTML={{ __html: `&#169;${languageContent[localeData.currentLanguage].footer_copy }`}} />
        <ul className="privacy-list">
          <li><a href="/privacyPolicy" target="_blank">{languageContent[localeData.currentLanguage].footer_privacy}</a></li>
          <li><a href="/termsOfUse" target="_blank">{languageContent[localeData.currentLanguage].footer_terms}</a></li>
        </ul>
        {
          localeData && localeData.localeData && localeData.localeData.localeTemporary ? (
            <span style={{marginLeft:350}}>{ localeData.localeData.localeTemporary}</span>
          ) : <span></span>
        }
      </footer>
    );
  };
