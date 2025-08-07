import React from 'react';

interface BlurLoaderProps {
    loading: boolean;
    children: React.ReactNode;
}

const LoadingComponent: React.FC<BlurLoaderProps> = ({ loading, children }) => {
    return (
        <div style={{ position: 'relative' }}>
            {/* Nội dung được làm mờ nếu đang loading */}
            <div style={{ filter: loading ? 'blur(2px)' : 'none', pointerEvents: loading ? 'none' : 'auto' }}>
                {children}
            </div>

            {loading && (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        height: '100vh',
                        width: '100vw',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        zIndex: 9999,
                    }}
                >
                    <div className="spinner-border text-primary" role="status" />
                </div>
            )}
        </div>
    );
};

export default LoadingComponent;
