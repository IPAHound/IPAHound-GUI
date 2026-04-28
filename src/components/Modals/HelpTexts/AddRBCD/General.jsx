import React from 'react';
import PropTypes from 'prop-types';
import { groupSpecialFormat } from '../Formatter';

const General = ({ sourceName, sourceType, targetName }) => {
    return (
        <>
            <p>
                {groupSpecialFormat(sourceType, sourceName)} the capability to
                get the Kerberos keys the {' '}
                {targetName} account.
            </p>

            <p>
                You can add RBCD delegation. Just set memberPrincipal on {targetName} in LDAP to {groupSpecialFormat(sourceType, sourceName)}.
                Or you can use ipa service-add-delegation or
            </p>
        </>
    );
};

General.propTypes = {
    sourceName: PropTypes.string,
    sourceType: PropTypes.string,
    targetName: PropTypes.string,
};

export default General;
