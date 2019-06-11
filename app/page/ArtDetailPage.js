import React, { useState, useEffect, useCallback, useMemo } from 'react'
import UserScrollList from '@comp/UserScrollList'
import { CommentList } from '@comp/Comment'
import UserLink from '@comp/UserLink'
import { getArtWorkDetail, addComment, getLocalLoginInfo, deleteComment } from '@util/api'
import { useSimpleFetch } from '@util/effect'
import FavButton from '@comp/FavButton'
import { getUserAvatar, getArtWrokPreviewUrl } from '@util/imgUri'
import { Link } from 'react-router-dom'

const ArtDetail = (props) => {
  const { userid, artworkid } = props.match.params
  const [ isLoading, data, refresh ] = useSimpleFetch(getArtWorkDetail, {artworkid})
  return <div className='art-detail-page'>
    <img className='art-preview' src={getArtWrokPreviewUrl(userid, artworkid)} />
    {
      isLoading || <>
                <div className="art-info-title">{data.artwork.title}</div>
                <div className="desc-info">
                  {data.artwork.description}
                </div>
                <UserLink
                  padding
                  userid={userid}
                  username={data.author.username}
                  userpagename={data.author.userpagename}
                  withFocus
                  refresh={refresh}
                  watch={data.watch}
                />
                <UserScrollList
                  title={<>
                        {`${data.artwork.favcount}只兽收藏了此作品`}
                        <FavButton fav={data.fav} artworkid={artworkid} refresh={refresh} />
                    </>}
                  userList={data.favlist}
                />
                <CommentList
                  enableDelButton
                  checkItemCanbeDel={(item) => {
                    if (!getLocalLoginInfo().login) { return false }
                    if (getLocalLoginInfo().user.userid === userid) { return true }
                    if (item.userid === getLocalLoginInfo().user.userid) {return true}
                    return false
                  }}
                  delFunc={deleteComment}
                  commentList={data.commentlist}
                  refresh={refresh}
                  submitParams={{contentid: artworkid, typeid: '1'}}
                  submitFunc={addComment}
                />
            </>
    }
  </div>
}

export default ArtDetail