import React, { ChangeEvent, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { KartRecordProps } from '../../interface'
import { useAppSelector } from '../../redux/store'
import { formatTime } from '../../util'

export default function KartRecord({
  onTrackError,
  onKartError,
}: KartRecordProps) {
  const kartInfo = useAppSelector((state) => state.user.kart)
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    setSelected(0)
  }, [kartInfo])

  return (
    <TabContent>
      <TabTitle>
        <span>카트</span> 전적
      </TabTitle>
      <TopContent>
        <TopTitle>
          <Badge>일반</Badge>
          {kartInfo[selected].name}
        </TopTitle>
        <Kart>
          <Thumbnail>
            <KartImg
              src={`https://s3-ap-northeast-1.amazonaws.com/solution-userstats/metadata/kart/${kartInfo[selected].id}.png`}
              onError={onKartError}
              alt="카트 이미지"
            />
          </Thumbnail>
          <Record>
            <ul>
              {kartInfo[selected].map.map((track, index) => (
                <KartRecordItem key={index}>
                  <TrackImg
                    // src={`https://s3-ap-northeast-1.amazonaws.com/solution-userstats/kartimg/Category/${track.id}_1.png`}
                    src="https://s3-ap-northeast-1.amazonaws.com/solution-userstats/kartimg/Category/unknown_1.png"
                    onError={onTrackError}
                  />
                  <TrackInfo>{track.name}</TrackInfo>
                  <TrackInfo>{formatTime(track.record)}</TrackInfo>
                </KartRecordItem>
              ))}
            </ul>
          </Record>
        </Kart>
      </TopContent>
      <TableBox>
        <Table>
          <Thead>
            <tr>
              <Th>선택</Th>
              <Th>카트</Th>
              <Th>횟수</Th>
              <Th>승률</Th>
              <Th>리타율</Th>
            </tr>
          </Thead>
          <tbody>
            {kartInfo.map((kart, index) => (
              <Tr
                key={kart.id}
                className={`${selected === index ? 'active' : ''}`}
              >
                <Td>
                  <input
                    type="radio"
                    value={index}
                    checked={selected === index}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setSelected(Number(e.target.value))
                    }
                  ></input>
                </Td>
                <Td className="left">
                  <img
                    src={`https://s3-ap-northeast-1.amazonaws.com/solution-userstats/metadata/kart/${kart.id}.png`}
                    alt="카트 이미지"
                    onError={onKartError}
                    height={27}
                  />
                  &nbsp; {kart.name}
                </Td>
                <Td>{kart.count}</Td>
                <Td>{`${Math.round((kart.winCount / kart.count) * 100)}%`}</Td>
                <Td>{`${Math.round(
                  (kart.retireCount / kart.count) * 100,
                )}%`}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableBox>
    </TabContent>
  )
}

export const TabContent = styled.section`
  position: relative;
  margin-bottom: 10px;
  background-color: #fff;
  border: 1px solid #f2f2f2;
  font-size: 12px;
`

export const TabTitle = styled.h5`
  position: relative;
  padding: 0 8px;
  margin-top: 15px;
  margin-left: 20px;
  margin-right: 20px;
  line-height: 40px;
  font-size: 14px;
  font-weight: bold;
  color: var(--black);
  vertical-align: middle;

  span {
    margin-right: 5px;
    font-size: 14px;
    color: var(--blue);
  }
`
export const TopContent = styled.article`
  margin: 0 25px 0 25px;
  padding-top: 15px;
  padding-bottom: 15px;
  border-top: 1px solid #ccc;
`

export const TopTitle = styled.p`
  color: var(--black);
  font-size: 14px;
`

const Badge = styled.span`
  display: inline-block;
  width: 40px;
  height: 20px;
  margin-right: 5px;
  vertical-align: middle;
  text-align: center;
  line-height: 15px;
  font-size: 12px;
  font-weight: 400;
  border: 1px solid #1f334a;
  border-radius: 15px;
  color: #1f334a;
`

const Kart = styled.section`
  display: flex;
  padding: 10px 0;
`

const Thumbnail = styled.article`
  position: relative;
  flex: 4;
  text-align: center;
  line-height: 135px;
  border-right: 1px solid #ccc;
`

const KartImg = styled.img`
  height: 70px;
  vertical-align: middle;
`

const Record = styled.section`
  flex: 6;
`

const KartRecordItem = styled.li`
  position: relative;
  display: flex;
  height: 33px;
  padding-left: 10px;
  line-height: 33px;
  text-align: left;
  align-items: center;
`

const TrackImg = styled.img`
  height: 23px;
`

const TrackInfo = styled.span`
  overflow: hidden;
  margin-left: 5px;
  max-width: 85px;
  text-overflow: ellipsis;
  white-space: nowrap;

  :last-child {
    position: absolute;
    right: 0;
  }
`

export const TableBox = styled.section`
  overflow-y: auto;
  height: 235px;
  text-align: center;
  border-top: 1px solid #f2f2f2;
  font-weight: 400;
`

export const Table = styled.table`
  width: calc(100% - 1px);
  font-size: 13px;
  line-height: 35px;
  border-collapse: collapse;
`

export const Thead = styled.thead`
  background-color: #fbfbfb;
`

export const Th = styled.th`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    display: inline-block;
    width: 1px;
    height: 15px;
    top: 10px;
    right: 0;
    background-color: #ccc;
  }
`

export const Tr = styled.tr`
  &.active {
    border: 1px solid var(--blue);
  }
`

export const Td = styled.td`
  line-height: 45px;

  &.left {
    display: flex;
    padding-left: 10px;
    align-items: center;
    text-align: left;
  }
`
