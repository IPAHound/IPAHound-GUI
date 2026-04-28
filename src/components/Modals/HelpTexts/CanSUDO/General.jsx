import React from 'react';
import PropTypes from 'prop-types';
import { groupSpecialFormat } from '../Formatter';

const General = ({ sourceName, sourceType, targetName }) => {
    return (
        <>
            <p>
                {groupSpecialFormat(sourceType, sourceName)} the capability to
                use SUDO in the computer{' '}
                {targetName}.
            </p>

            <p>
                SUDO access HBAC rule and SUDO rule allows you to privilege escalation. You can click on edge to get information about the Sudo rule, commands, and parameters allowed for SUDO.
            </p>
            <p>Note: This edge does not guarantee privileged execution.</p>
        </>
    );
};

General.propTypes = {
    sourceName: PropTypes.string,
    sourceType: PropTypes.string,
    targetName: PropTypes.string,
};

export default General;
