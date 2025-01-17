import React, { ChangeEvent, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useQuery } from 'react-query'
import { matchApi } from '../api'
import Loading from '../components/common/Loading'
import { PageWrapper } from './Home'
import TrackTable from '../components/track/TrackTable'
import { ISort, ITrackDetail } from '../interface'
import IndicatorGuide from '../components/track/IndicatorGuide'
import HelmetWrapper from '../components/common/Helmet'
import { useAppDispatch, useAppSelector } from '../redux/store'
import { useNavigate } from 'react-router-dom'
import { gameType, MATCH_TYPE, reset } from '../redux/slice'
import MatchTypeSwitch from '../components/MatchTypeSwitch'

export default function Track() {
  const matchType = useAppSelector((state) => state.user.gameType)
  const dispatch = useAppDispatch()
  const navigator = useNavigate()
  const { data, isFetching } = useQuery(
    [matchType],
    () => matchApi.all(matchType),
    {
      staleTime: 60 * 1000,
      retry: false,
      onError: () => {
        alert('에러가 발생하였습니다. 잠시 뒤 다시 시도해주세요.')
        dispatch(reset())
        navigator('/')
      },
    },
  )
  const [tracks, setTracks] = useState<ITrackDetail[] | undefined>(
    data?.tracks || [],
  )
  const [value, setValue] = useState('')
  const [guide, setGuide] = useState(false)
  const [selected, setSelected] = useState<keyof typeof MATCH_TYPE>(
    '7b9f0fd5377c38514dbb78ebe63ac6c3b81009d5a31dd569d1cff8f005aa881a',
  )
  const [sort, setSort] = useState<ISort>({
    standard: 'count',
    seq: 'desc',
  })

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e

    setValue(value)

    const filteredTracks = data!.tracks.filter(
      (track) => track.bestRider.includes(value) || track.name.includes(value),
    )

    setTracks(filteredTracks)
  }

  const onClick = (key: keyof typeof MATCH_TYPE) => {
    setSelected(key)
    dispatch(gameType(key))
  }

  useEffect(() => {
    setTracks(data?.tracks)
  }, [data])

  if (isFetching || !data) {
    return (
      <PageWrapper>
        <HelmetWrapper content="트랙 | TMI" />
        <Loading />
      </PageWrapper>
    )
  }

  return (
    <Wrapper>
      <HelmetWrapper content="트랙 | TMI" />
      <Title>
        스피드 {matchType === Object.keys(MATCH_TYPE)[0] ? '개인전' : '팀전'}{' '}
        트랙 순위
      </Title>
      <Line />
      <SwitchWrapper>
        <MatchTypeSwitch selected={selected} onClick={onClick} />
      </SwitchWrapper>
      <SubTitle>
        <span>순위 산정기간:</span>
        현재 날짜 기준
      </SubTitle>
      <Section>
        <SearchBox>
          <form>
            <Search
              value={value}
              onChange={onChange}
              placeholder="트랙/베스트 라이더 검색"
            />
          </form>
          <Guide>
            스피드개인전 공방 기준 통계입니다.
            <GuideButton onClick={() => setGuide(true)}>
              지표 가이드
            </GuideButton>
          </Guide>
          {guide && <IndicatorGuide onClose={() => setGuide(false)} />}
        </SearchBox>
        <TrackTable
          tracks={tracks}
          totalCount={data.totalCount}
          sort={sort}
          setSort={setSort}
        />
      </Section>
    </Wrapper>
  )
}

const Wrapper = styled(PageWrapper)`
  padding-top: 50px;
`

const Title = styled.h1`
  margin-bottom: 10px;
  padding-left: 10px;
  font-size: 22px;
  font-weight: 400;
`

const Line = styled.article`
  /* display: inline-block; */
  width: 35px;
  height: 3px;
  margin-left: 10px;
  vertical-align: top;
  background-color: #1f334a;
`

const SubTitle = styled.p`
  padding-left: 10px;
  font-size: 12px;
  font-weight: 400;
  color: var(--black);

  span {
    margin-right: 5px;
    font-weight: bold;
  }
`

const Section = styled.section`
  margin-top: 30px;
  background-color: white;
`

const SearchBox = styled.article`
  position: relative;
  display: flex;
  height: 69px;
  padding-left: 25px;
  line-height: 67px;
  font-size: 12px;
  border-bottom: 1px solid #ccc;
`

const Guide = styled.span`
  position: absolute;
  right: 10px;
  color: #6c7a89;
`

const GuideButton = styled.button`
  display: inline-block;
  width: 70px;
  margin-left: 15px;
  font-size: 12px;
  text-align: center;
  text-decoration: none;
  color: var(--blue);
  background-color: transparent;
  line-height: 20px;
  border: 1px solid var(--blue);

  &:hover {
    color: white;
    background-color: var(--blue);
  }
`

const Search = styled.input`
  display: inline-block;
  width: 241px;
  height: 36px;
  padding: 0 10px;
  box-sizing: border-box;
  font-size: 14px;
  outline: none;
  border: 1px sßolid #ccc;
`

const SwitchWrapper = styled.div`
  padding: 0 0 10px 10px;
`
