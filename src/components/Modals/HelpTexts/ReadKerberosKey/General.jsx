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
                You can use ipa-getkeytab for keytab retrieval (waring! use options -r for retrieval, by default ipa-getkeytab will be reset keys).
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
