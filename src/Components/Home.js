import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./SocketProvider";
import { Form, Row, Col, Button, Input, Select } from 'antd'
import './Home.css';
import { languages } from "../constants/languages";
const { Option } = Select;

const HomePage = () => {
    const [email, setEmail] = useState('');
    const [room, setRoom] = useState('');
    const [profileId, setProfileId] = useState('');
    const [languageCode, setLanguageCode] = useState('');

    // console.log(languageCode, 'languageCode')
    const socket = useSocket();
    const navigate = useNavigate();

    const handleSubmitForm = useCallback(
        () => {
            socket.emit("room:join", { email, room, profileId });
        },
        [email, room, profileId, socket]
    );

    const handleJoinRoom = useCallback(
        (data) => {
            const { room, profileId } = data;
            if (room && profileId) {
                navigate(profileId === '1' ? `/room/${room}` : `/listenerRoom/${room}`);
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
                                    onChange={(e) => setProfileId(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        {profileId === '2' && <Col xs={24} sm={24} md={12} lg={12} xl={12}>
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

export default HomePage;