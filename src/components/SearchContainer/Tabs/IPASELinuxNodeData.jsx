import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { AppContext } from '../../../AppContext';
import CollapsibleSection from './Components/CollapsibleSection';
import ExtraNodeProps from './Components/ExtraNodeProps';
import MappedNodeProps from './Components/MappedNodeProps';
import NodeCypherLink from './Components/NodeCypherLink';
import NodePlayCypherLink from './Components/NodePlayCypherLink';
import styles from './NodeData.module.css';

const IPASELinuxNodeData = () => {
    const [visible, setVisible] = useState(false);
    const [objectid, setObjectid] = useState(null);
    const [label, setLabel] = useState(null);
    const [domain, setDomain] = useState(null);
    const [nodeProps, setNodeProps] = useState({});
    const context = useContext(AppContext);

    useEffect(() => {
        emitter.on('nodeClicked', nodeClickEvent);

        return () => {
            emitter.removeListener('nodeClicked', nodeClickEvent);
        };
    }, []);

    const nodeClickEvent = (type, id, blocksinheritance, domain) => {
        if (type === 'IPASeLinux') {
            setVisible(true);
            setObjectid(id);
            setDomain(domain);
            let session = driver.session();
            session
                .run(`MATCH (n:IPASeLinux {objectid: $objectid}) RETURN n AS node`, {
                    objectid: id,
                })
                .then((r) => {
                    let props = r.records[0].get('node').properties;
                    setNodeProps(props);
                    setLabel(props.name || props.azname || objectid);
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
                            <NodeCypherLink
                                property='Reachable High Value Targets'
                                target={objectid}
                                baseQuery={
                                    'MATCH (m:IPASeLinux {objectid: $objectid}),(n {highvalue:true}),p=shortestPath((m)-[r*1..]->(n)) WHERE NONE (r IN relationships(p) WHERE type(r)= "GetChanges") AND NONE (r in relationships(p) WHERE type(r)="GetChangesAll") AND NOT m=n'
                                }
                                start={label}
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

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

                <CollapsibleSection header='IPAGROUP MEMBERS'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='Unrolled Members'
                                target={objectid}
                                baseQuery={
                                    'MATCH p =(n)-[r:MemberOf*1..]->(g:IPASeLinux {objectid: $objectid})'
                                }
                                end={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header='IPAGROUP MEMBERSHIP'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='Unrolled Member Of'
                                target={objectid}
                                baseQuery={
                                    'MATCH p = (g1:IPASeLinux {objectid: $objectid})-[r:MemberOf*1..]->(n)'
                                }
                                start={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header='OUTBOUND OBJECT CONTROL'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='First Degree Object Control'
                                target={objectid}
                                baseQuery={
                                    'MATCH p = (g:IPASeLinux {objectid: $objectid})-[r]->(n) WHERE r.isacl=true'
                                }
                                start={label}
                                distinct
                            />
                            <NodeCypherLink
                                property='IPAGroup Delegated Object Control'
                                target={objectid}
                                baseQuery={
                                    'MATCH p = (g1:IPASeLinux {objectid: $objectid})-[r1:MemberOf*1..]->(g2:IPAGroup)-[r2]->(n) WHERE r2.isacl=true'
                                }
                                start={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Transitive Object Control'
                                target={objectid}
                                baseQuery={
                                    'MATCH (n) WHERE NOT n.objectid=$objectid WITH n MATCH p = shortestPath((g:IPASeLinux {objectid: $objectid})-[r:MemberOf|ForceChangePassword|ReadKerberosKey|Owns|AddMember*1..]->(n))'
                                }
                                start={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header='INBOUND CONTROL RIGHTS'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='Explicit Object Controllers'
                                target={objectid}
                                baseQuery={
                                    'MATCH p = (n)-[r:MemberOf|ForceChangePassword|ReadKerberosKey|Owns|AddMember]->(g:IPASeLinux {objectid: $objectid})'
                                }
                                end={label}
                                distinct
                            />
                            <NodeCypherLink
                                property='Unrolled Object Controllers'
                                target={objectid}
                                baseQuery={
                                    'MATCH p = (n)-[r:MemberOf*1..]->(g1:IPASeLinux)-[r1]->(g2:IPASeLinux {objectid: $objectid}) WITH LENGTH(p) as pathLength, p, n WHERE NONE (x in NODES(p)[1..(pathLength-1)] WHERE x.objectid = g2.objectid) AND NOT n.objectid = g2.objectid AND r1.isacl=true'
                                }
                                end={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Transitive Object Controllers'
                                target={objectid}
                                baseQuery={
                                    'MATCH (n) WHERE NOT n.objectid=$objectid WITH n MATCH p = shortestPath((n)-[r:MemberOf|ForceChangePassword|ReadKerberosKey|Owns|AddMember*1..]->(g:IPASeLinux {objectid: $objectid}))'
                                }
                                end={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                {/*  <Notes objectid={objectid} type='Group' />
                 <NodeGallery
                     objectid={objectid}
                     type='Group'
                     visible={visible}
                /> */}
            </div>
        </div>
    );
};

IPASELinuxNodeData.propTypes = {};
export default IPASELinuxNodeData;
