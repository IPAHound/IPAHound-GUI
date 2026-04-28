import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { AppContext } from '../../../AppContext';
import CollapsibleSection from './Components/CollapsibleSection';
import ExtraNodeProps from './Components/ExtraNodeProps';
import MappedNodeProps from './Components/MappedNodeProps';
import NodeCypherLink from './Components/NodeCypherLink';
import NodeCypherNoNumberLink from './Components/NodeCypherNoNumberLink';
import styles from './NodeData.module.css';

const IPATemplateNodeData = () => {
    const [visible, setVisible] = useState(false);
    const [objectid, setObjectid] = useState(null);
    const [label, setLabel] = useState(null);
    const [domain, setDomain] = useState(null);
    const [nodeProps, setNodeProps] = useState({});
    const [blocksInheritance, setBlocksInheritance] = useState(false);
    const context = useContext(AppContext);

    useEffect(() => {
        emitter.on('nodeClicked', nodeClickEvent);

        return () => {
            emitter.removeListener('nodeClicked', nodeClickEvent);
        };
    }, []);

    const nodeClickEvent = (type, id, blocksinheritance, domain) => {
        if (type === 'IPACertificateTemplate') {
            setVisible(true);
            setObjectid(id);
            setDomain(domain);
            setBlocksInheritance(blocksinheritance);
            let session = driver.session();
            session
                .run(`MATCH (n:IPACertificateTemplate {objectid: $objectid}) RETURN n AS node`, {
                    objectid: id,
                })
                .then((r) => {
                    let props = r.records[0].get('node').properties;
                    setNodeProps(props);
                    setLabel(props.name);
                    session.close();
                });
        } else {
            setObjectid(null);
            setVisible(false);
        }
    };

    const displayMap = {
        objectid: 'Object ID',
        'Template Name': 'Template Name',
        'Display Name': 'Display Name',
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

                <MappedNodeProps
                    displayMap={displayMap}
                    properties={nodeProps}
                    label={label}
                />

                <hr></hr>

                <ExtraNodeProps
                    displayMap={displayMap}
                    properties={nodeProps}
                    label={label}
                />

                <hr></hr>

                <CollapsibleSection header={'INBOUND CONTROL RIGHTS'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='Explicit Object Controllers'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(n)-[r:AllExtendedRights|GenericAll|GenericWrite|WriteDacl|AddMember|WriteOwner|WriteProperty|Owns]->(u1:IPACertificateTemplate {objectid: $objectid}) WHERE r.isacl=true'
                                }
                                end={label}
                                distinct
                            />
                            <NodeCypherLink
                                property='Unrolled Object Controllers'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(n)-[r:MemberOf*1..]->(g:Group)-[r1:AllExtendedRights|AddMember|GenericAll|GenericWrite|WriteDacl|WriteOwner|WriteProperty|Owns]->(u:IPACertificateTemplate {objectid: $objectid}) WITH LENGTH(p) as pathLength, p, n WHERE NONE (x in NODES(p)[1..(pathLength-1)] WHERE x.objectid = u.objectid) AND NOT n.objectid = u.objectid'
                                }
                                end={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header={'ENROLLMENT RIGHTS'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='First Degree Enrollment Rights'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(n)-[r:AutoEnroll|Enroll|GenericAll|AddMember]->(u1:IPACertificateTemplate {objectid: $objectid}) WHERE r.isacl=true'
                                }
                                end={label}
                                distinct
                            />
                            <NodeCypherLink
                                property='Group Delegated Enrollment Rights'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(n)-[r:MemberOf*1..]->(g:Group)-[r1:AutoEnroll|Enroll|GenericAll|AddMember]->(u:IPACertificateTemplate {objectid: $objectid}) WITH LENGTH(p) as pathLength, p, n WHERE NONE (x in NODES(p)[1..(pathLength-1)] WHERE x.objectid = u.objectid) AND NOT n.objectid = u.objectid'
                                }
                                end={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>
            </div>
        </div>
    );
};

IPATemplateNodeData.propTypes = {};
export default IPATemplateNodeData;
