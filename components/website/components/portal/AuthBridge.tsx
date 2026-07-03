import React from 'react';

interface AuthBridgeProps {
    children: React.ReactNode;
}

/** AuthBridge — No-op wrapper.
 *  Auth0 handles authentication directly. No bridge needed.
 */
export const AuthBridge: React.FC<AuthBridgeProps> = ({ children }) => {
    return <>{children}</>;
};
