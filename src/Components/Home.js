import React, { useState, useCallback, useEffect } from "react";
import { connect } from 'react-redux';
import { Form, Row, Col, Button, Input, Select } from 'antd';
import { useNavigate } from "react-router-dom";
import { useSocket } from "./SocketProvider";
import { languages } from "../constants/languages";
import { setUserProfileId } from "../store/actions/webrtcAction";
import './Home.css';

const { Option } = Select;

const mapStateToProps = (state) => {
    return {
        profileId: state?.webrtcReducer?.profileId
    }
};

const mapDispatchToProps = (dispatch) => ({
    dispatchProfileId: (id) => dispatch(setUserProfileId(id))
})
const HomePageBase = (props) => {
    const [email, setEmail] = useState('');
    const [room, setRoom] = useState('');
    const [languageCode, setLanguageCode] = useState('');
    const { profileId, dispatchProfileId } = props;
 
    const socket = useSocket();
    const navigate = useNavigate();

    const handleSubmitForm = useCallback(
        () => {
            socket.emit("room:join", { email, room });
        },
        [email, room, socket]
    );

    const handleJoinRoom = useCallback(
        (data) => {
            const { room } = data;
            if (room) {
                navigate(`/room/${room}`);
            }
        },
        [navigate]
    );

    useEffect(() => {
        socket.on("room:join", handleJoinRoom);
        return () => {
            socket.off("room:join", handleJoinRoom);
        };
    }, [socket, handleJoinRoom]);

    const onChangeLanguage = (value) => {
        setLanguageCode(value)
    }
    return (
        <div className="container">
            <h1>Welcome to My Translation Web Page</h1>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}

                initialValues={{
                    remember: true,
                }}
                onFinish={handleSubmitForm}
                autoComplete="off"
            >
                <Row>
                    <Col xs={24} sm={24} md={20} lg={20} xl={20}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Email ID"
                                name="email"
                                rules={[{ required: true, message: 'Please Enter Email ID' },
                                ]}
                            >
                                <Input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Room Number"
                                name="room"
                                rules={[{ required: true, message: 'Please Enter Room Number' },
                                ]}
                            >
                                <Input
                                    type="number"
                                    id="room"
                                    value={room}
                                    onChange={(e) => setRoom(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Profile ID"
                                name="profile"
                                rules={[{ required: true, message: 'Please Enter Profile ID' },
                                ]}
                            >
                                <Input
                                    type="number"
                                    id="profile"
                                    value={profileId}
                                    onChange={(e) => dispatchProfileId(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        {profileId && profileId === '2' && <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Language"
                                name="language"
                                rules={[{ required: true, message: 'Please Select Language' },
                                ]}
                            >
                                <Select onChange={onChangeLanguage} id="language">
                                    {languages.map(item => <Option key={item.id} value={item.code} >{item.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>}
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    Join
                                </Button>
                            </Form.Item>
                        </Col>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

const HomePage = connect(mapStateToProps, mapDispatchToProps)(HomePageBase);
export default HomePage;