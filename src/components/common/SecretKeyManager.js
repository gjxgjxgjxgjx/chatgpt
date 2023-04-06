import React, { useState, useEffect } from "react";

const getSecretKey = () => {
    const secretKey = document.cookie.match(/secretkey=([^;]+)/);
    return secretKey && secretKey[1];
};

const setSecretKey = (secretKey) => {
    document.cookie = `secretkey=${secretKey}; path=/; max-age=31536000`;
};

const SecretKeyManager = () => {
    const [secretKey, setKey] = useState("");

    useEffect(() => {
        setKey(getSecretKey() || "");
    }, []);

    const handleSave = () => {
        setSecretKey(secretKey);
        alert("Secret Key 已保存");
    };

    return (
        <div>
            <input
                type="password"
                value={secretKey}
                onChange={(e) => setKey(e.target.value)}
                placeholder="输入 secret key"
            />
            <button onClick={handleSave}>保存</button>
        </div>
    );
};

const getAuthorizationHeader = () => {
    const secretKey = getSecretKey();
    return secretKey ? `Bearer ${secretKey}` : "";
};

export { getAuthorizationHeader };
export default SecretKeyManager;
