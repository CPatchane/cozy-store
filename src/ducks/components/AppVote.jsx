import React from 'react'
import voteIllustration from 'assets/icons/app-vote.svg'
import Icon from 'cozy-ui/react/Icon'
import { translate } from 'cozy-ui/react/I18n'
import { popupCenter } from 'lib/popup'

const VOTING_LINK = 'https://framaforms.org/collect-1518082910'

export const AppVote = ({ t }) => (
  <div className="sto-app-vote-wrapper">
    <a
      className="sto-app-vote"
      onClick={() => popupCenter(VOTING_LINK, 'Cozy app voting', 700, 650)}
    >
      <Icon
        icon={voteIllustration}
        height="60"
        width="55"
        className="sto-app-vote-icon"
      />
      <strong>
        <p>{t('app_vote.line1')}</p>
        <p>{t('app_vote.line2')}</p>
      </strong>
    </a>
  </div>
)

export default translate()(AppVote)
