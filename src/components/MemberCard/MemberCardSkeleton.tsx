import React from 'react';

const MemberCardSkeleton: React.FC = () => {
    return (
        <div className='wrapperCard skeletonWrapperCard'>
            <div className='homeCardImage'>
                <div className='imageSkeleton'></div>
            </div>
            <div className='homeCardContent'>
                <div className='homeCardMember'>
                    <div className='textSkeleton' style={{ width: '60%' }}></div>
                    <div className='textSkeleton' style={{ width: '40%' }}></div>
                </div>
                <div className='homeCardMemberInfo'>
                    <div className='homeMemberBirth' style={{ width: '70%' }}>
                        <div className='textSkeleton' style={{ width: '80%' }}></div>
                        <div className='textSkeleton' style={{ width: '30%' }}></div>
                    </div>
                    <div className='homeMemberDoc' style={{ width: '70%' }}>
                        <div className='textSkeleton' style={{ width: '80%' }}></div>
                        <div className='textSkeleton' style={{ width: '30%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberCardSkeleton;
