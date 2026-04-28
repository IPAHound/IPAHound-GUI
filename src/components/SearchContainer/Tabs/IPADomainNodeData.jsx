import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import CollapsibleSection from './Components/CollapsibleSection';
import NodeCypherLinkComplex from './Components/NodeCypherLinkComplex';
import NodeCypherLink from './Components/NodeCypherLink';
import NodeCypherNoNumberLink from './Components/NodeCypherNoNumberLink';
import MappedNodeProps from './Components/MappedNodeProps';
import ExtraNodeProps from './Components/ExtraNodeProps';
import NodePlayCypherLink from './Components/NodePlayCypherLink';
import NodeCypherLabel from './Components/NodeCypherLabel';
import { Table } from 'react-bootstrap';
import styles from './NodeData.module.css';
import { AppContext } from '../../../AppContext';

const IPADomainNodeData = () => {
    const [visible, setVisible] = useState(false);
    const [objectid, setObjectid] = useState(null);
    const [label, setLabel] = useState(null);
    const [domain, setDomain] = useState('');
    const [nodeProps, setNodeProps] = useState({});
    const context = useContext(AppContext);

    useEffect(() => {
        emitter.on('nodeClicked', nodeClickEvent);

        return () => {
            emitter.removeListener('nodeClicked', nodeClickEvent);
        };
    }, []);

    const nodeClickEvent = (type, id, domain) => {
        if (type === 'IPADomain') {
            setVisible(true);
            setObjectid(id);
            let session = driver.session();
            session
                .run(
                    `MATCH (n:IPADomain {objectid: $objectid}) RETURN n AS node`,
                    {
                        objectid: id,
                    }
                )
                .then((r) => {
                    let props = r.records[0].get('node').properties;
                    setNodeProps(props);
                    setLabel(props.name || props.azname || objectid);
                    setDomain(props.domain || objectid);
                    session.close();
                });
        } else {
            setObjectid(null);
            setVisible(false);
        }
    };

    const displayMap = {
        objectid: 'Object ID',
        description: 'Description',
        functionallevel: 'Domain Functional Level',
        'ms-ds-machineaccountquota': 'Machine Account Quota',
    };

    return objectid === null ? (
        <div></div>
    ) : (
        <div
            className={clsx(
                !visible && 'displaynone',
                context.darkMode ? styles.dark : styles.light
            )}
        >
            <div className={clsx(styles.dl)}>
                <h5>{label || objectid}</h5>

                <CollapsibleSection header='OVERVIEW'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLabel
                                    property={'Users'}
                                    target={objectid}
                                    baseQuery={
                                        'MATCH (n:IPAUser) WHERE n.domain=$domain'
                                    }
                                    domain={domain}
                                />
                                <NodeCypherLabel
                                    property={'Groups'}
                                    target={objectid}
                                    baseQuery={
                                        'MATCH (n:IPAGroup) WHERE n.domain=$domain'
                                    }
                                    domain={domain}
                                />
                                <NodeCypherLabel
                                    property={'Computers'}
                                    target={objectid}
                                    baseQuery={
                                        'MATCH (n:IPAComputer) WHERE n.domain=$domain'
                                    }
                                    domain={domain}
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>
                <MappedNodeProps
                    displayMap={displayMap}
                    properties={nodeProps}
                    label={label}
                />
                <ExtraNodeProps
                    displayMap={displayMap}
                    properties={nodeProps}
                    label={label}
                />

                <hr></hr>

                <CollapsibleSection header='INBOUND CONTROL RIGHTS'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                                <NodeCypherLink
                                    property='First Degree Controllers'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n)-[r]->(u:IPADomain {objectid: $objectid}) WHERE r.isacl=true'
                                    }
                                    distinct
                                />
                                <NodeCypherLink
                                    property='Unrolled Controllers'
                                    target={objectid}
                                    baseQuery={
                                        'MATCH p=(n)-[r:MemberOf*0..]->(g:IPAGroup)-[r1]->(u:IPADomain {objectid: $objectid}) WHERE r1.isacl=true'
                                    }
                                    distinct
                                />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection header='TRUSTS'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='First Degree Trusts'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(a:IPADomain {objectid: $objectid})-[r:TrustedBy]-(n:Domain)'
                                }
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                {}
            </div>
        </div>
    );
};

IPADomainNodeData.propTypes = {};
export default IPADomainNodeData;
