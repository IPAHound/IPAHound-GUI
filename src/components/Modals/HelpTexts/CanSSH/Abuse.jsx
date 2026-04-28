import React from 'react';
import PropTypes from 'prop-types';

const Abuse = ({ sourceName, sourceType, targetName }) => {
    return (
        <>
            <p>
                Abuse of this privilege will depend heavily on the type of
                access you have. You can use plaintext, ssh key or kerberos for SSH authorization.
            </p>
        </>
    );
};

Abuse.propTypes = {
    sourceName: PropTypes.string,
    sourceType: PropTypes.string,
    targetName: PropTypes.string,
};

export default Abuse;
