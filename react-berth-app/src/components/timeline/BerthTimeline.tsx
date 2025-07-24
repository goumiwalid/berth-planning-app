import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Select,
  Button,
  Space,
  Typography,
  Tooltip,
  message,
  DatePicker,
  Skeleton,
} from 'antd';
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  CalendarOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Timeline } from 'vis-timeline/standalone';
import { DataSet } from 'vis-data/esnext';
import { Vessel, Berth, Terminal } from '../../types';
import { MockDataService } from '../../services/mockData';
import { vesselTypeColors, vesselStatusColors } from '../../utils/theme';
import { TIMELINE_SCALES } from '../../utils/constants';
import FeatureErrorBoundary from '../common/FeatureErrorBoundary';

const { Option } = Select;
const { Title } = Typography;

interface BerthTimelineProps {
  selectedTerminalId?: string;
  onVesselSelect?: (vessel: Vessel) => void;
}

interface TimelineItem {
  id: string;
  content: string;
  start: Date;
  end: Date;
  group: string;
  className: string;
  title: string;
  vessel: Vessel;
}

interface TimelineGroup {
  id: string;
  content: string;
  order: number;
  berth: Berth;
}

const BerthTimeline: React.FC<BerthTimelineProps> = ({
  selectedTerminalId,
  onVesselSelect,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineInstance = useRef<Timeline | null>(null);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [berths, setBerths] = useState<Berth[]>([]);
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentScale, setCurrentScale] = useState('day');
  const [currentDate, setCurrentDate] = useState(dayjs());

  useEffect(() => {
    loadData();
  }, [selectedTerminalId]);

  useEffect(() => {
    if (timelineRef.current && vessels.length > 0 && berths.length > 0) {
      initializeTimeline();
    }

    return () => {
      if (timelineInstance.current) {
        timelineInstance.current.destroy();
      }
    };
  }, [vessels, berths, currentScale]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [vesselsData, berthsData, terminalsData] = await Promise.all([
        MockDataService.getVessels(selectedTerminalId),
        MockDataService.getBerths(selectedTerminalId),
        MockDataService.getTerminals('tenant1'),
      ]);

      setVessels(vesselsData);
      setBerths(berthsData.filter(berth => berth.isActive));
      setTerminals(terminalsData);
    } catch (error) {
      console.error('Failed to load timeline data:', error);
      message.error('Failed to load timeline data');
    } finally {
      setLoading(false);
    }
  };

  const initializeTimeline = () => {
    if (!timelineRef.current) return;

    // Destroy existing timeline
    if (timelineInstance.current) {
      timelineInstance.current.destroy();
    }

    // Prepare groups (berths)
    const groups = new DataSet<TimelineGroup>(
      berths.map(berth => ({
        id: berth.id,
        content: `
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-weight: 600;">${berth.name}</span>
            <span style="font-size: 12px; color: #8c8c8c;">${berth.lengthM}m</span>
          </div>
        `,
        order: berth.position || 0,
        berth,
      }))
    );

    // Prepare items (vessels)
    const items = new DataSet<TimelineItem>(
      vessels.map(vessel => {
        const vesselTypeColor = vesselTypeColors[vessel.vesselType];
        const statusColor = vesselStatusColors[vessel.status];
        
        return {
          id: vessel.id,
          content: `
            <div style="padding: 4px 8px; font-size: 12px; font-weight: 600;">
              <div>${vessel.vesselName}</div>
              <div style="font-size: 10px; opacity: 0.8;">${vessel.voyageNumber}</div>
            </div>
          `,
          start: new Date(vessel.eta),
          end: new Date(vessel.etd),
          group: vessel.berthId,
          className: `vessel-item vessel-type-${vessel.vesselType.toLowerCase()} vessel-status-${vessel.status}`,
          title: `
            <div style="padding: 8px;">
              <h4 style="margin: 0 0 8px 0; color: #262626;">${vessel.vesselName}</h4>
              <p style="margin: 2px 0;"><strong>Voyage:</strong> ${vessel.voyageNumber}</p>
              <p style="margin: 2px 0;"><strong>Type:</strong> ${vessel.vesselType}</p>
              <p style="margin: 2px 0;"><strong>Operator:</strong> ${vessel.operator || 'N/A'}</p>
              <p style="margin: 2px 0;"><strong>LOA:</strong> ${vessel.loa}m</p>
              <p style="margin: 2px 0;"><strong>Draft:</strong> ${vessel.draft}m</p>
              <p style="margin: 2px 0;"><strong>ETA:</strong> ${dayjs(vessel.eta).format('MMM DD, YYYY HH:mm')}</p>
              <p style="margin: 2px 0;"><strong>ETD:</strong> ${dayjs(vessel.etd).format('MMM DD, YYYY HH:mm')}</p>
              <p style="margin: 2px 0;"><strong>Status:</strong> ${vessel.status.toUpperCase()}</p>
            </div>
          `,
          vessel,
        };
      })
    );

    // Timeline options
    const options = {
      stack: false,
      editable: {
        add: false,
        updateTime: true,
        updateGroup: true,
        remove: false,
      },
      start: currentDate.startOf('day').toDate(),
      end: currentDate.add(1, 'day').endOf('day').toDate(),
      orientation: 'top',
      showCurrentTime: true,
      zoomable: true,
      moveable: true,
      height: '400px',
      format: {
        minorLabels: {
          hour: 'HH:mm',
          day: 'DD',
          week: 'w',
          month: 'MMM',
        },
        majorLabels: {
          hour: 'ddd DD',
          day: 'MMM YYYY',
          week: 'MMM YYYY',
          month: 'YYYY',
        },
      },
      timeAxis: {
        scale: currentScale as any,
        step: 1,
      },
      tooltip: {
        followMouse: true,
        overflowMethod: 'cap' as any,
      },
      groupOrder: 'order',
    };

    // Create timeline
    timelineInstance.current = new Timeline(timelineRef.current, items, groups, options);

    // Event handlers
    timelineInstance.current.on('select', (properties) => {
      if (properties.items.length > 0) {
        const selectedItem = items.get(properties.items[0] as string) as TimelineItem;
        if (selectedItem && onVesselSelect) {
          onVesselSelect(selectedItem.vessel);
        }
      }
    });

    timelineInstance.current.on('itemover', (properties) => {
      // Could add hover effects here
    });

    // Add custom CSS styles
    addTimelineStyles();
  };

  const addTimelineStyles = () => {
    const styleId = 'berth-timeline-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .vessel-item {
        border-radius: 4px !important;
        border-width: 2px !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }

      .vessel-type-container {
        background: linear-gradient(135deg, ${vesselTypeColors.Container}, ${vesselTypeColors.Container}dd) !important;
        border-color: ${vesselTypeColors.Container} !important;
        color: white !important;
      }

      .vessel-type-roro {
        background: linear-gradient(135deg, ${vesselTypeColors.RoRo}, ${vesselTypeColors.RoRo}dd) !important;
        border-color: ${vesselTypeColors.RoRo} !important;
        color: white !important;
      }

      .vessel-type-bulk {
        background: linear-gradient(135deg, ${vesselTypeColors.Bulk}, ${vesselTypeColors.Bulk}dd) !important;
        border-color: ${vesselTypeColors.Bulk} !important;
        color: white !important;
      }

      .vessel-status-delayed {
        border-left: 4px solid ${vesselStatusColors.delayed} !important;
      }

      .vessel-status-at_berth {
        border-left: 4px solid ${vesselStatusColors.at_berth} !important;
      }

      .vis-item.vis-selected {
        border-color: #1890ff !important;
        box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.2) !important;
      }

      .vis-timeline {
        border: 1px solid #d9d9d9 !important;
        border-radius: 6px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }

      .vis-panel.vis-center,
      .vis-panel.vis-left,
      .vis-panel.vis-right,
      .vis-panel.vis-top,
      .vis-panel.vis-bottom {
        border-color: #f0f0f0 !important;
      }

      .vis-labelset .vis-label {
        border-color: #f0f0f0 !important;
        background: #fafafa !important;
      }

      .vis-time-axis .vis-text {
        color: #262626 !important;
        font-weight: 500 !important;
      }

      .vis-current-time {
        background-color: #ff4d4f !important;
        width: 3px !important;
      }
    `;
    document.head.appendChild(style);
  };

  const handleScaleChange = (scale: string) => {
    setCurrentScale(scale);
    if (timelineInstance.current) {
      timelineInstance.current.setOptions({
        timeAxis: { scale: scale as any, step: 1 }
      });
    }
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setCurrentDate(date);
      if (timelineInstance.current) {
        timelineInstance.current.setWindow(
          date.startOf('day').toDate(),
          date.add(1, 'day').endOf('day').toDate()
        );
      }
    }
  };

  const handleZoomIn = () => {
    if (timelineInstance.current) {
      timelineInstance.current.zoomIn(0.5);
    }
  };

  const handleZoomOut = () => {
    if (timelineInstance.current) {
      timelineInstance.current.zoomOut(0.5);
    }
  };

  const handleGoToToday = () => {
    const today = dayjs();
    setCurrentDate(today);
    if (timelineInstance.current) {
      timelineInstance.current.setWindow(
        today.startOf('day').toDate(),
        today.add(1, 'day').endOf('day').toDate()
      );
    }
  };

  const handleFullscreen = () => {
    if (timelineRef.current) {
      if (timelineRef.current.requestFullscreen) {
        timelineRef.current.requestFullscreen();
      }
    }
  };

  return (
    <FeatureErrorBoundary featureName="Berth Timeline" showDetails={process.env.NODE_ENV === 'development'}>
      <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          <CalendarOutlined /> Berth Planning Timeline
        </Title>
      </div>

      {/* Controls */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col>
            <Space>
              <span style={{ fontWeight: 500 }}>View:</span>
              <Select
                value={currentScale}
                onChange={handleScaleChange}
                style={{ width: 120 }}
              >
                {TIMELINE_SCALES.map(scale => (
                  <Option key={scale.value} value={scale.value}>
                    {scale.label}
                  </Option>
                ))}
              </Select>

              <DatePicker
                value={currentDate}
                onChange={handleDateChange}
                format="YYYY-MM-DD"
                allowClear={false}
              />
            </Space>
          </Col>

          <Col>
            <Space>
              <Tooltip title="Zoom In">
                <Button icon={<ZoomInOutlined />} onClick={handleZoomIn} />
              </Tooltip>
              <Tooltip title="Zoom Out">
                <Button icon={<ZoomOutOutlined />} onClick={handleZoomOut} />
              </Tooltip>
              <Tooltip title="Go to Today">
                <Button icon={<CalendarOutlined />} onClick={handleGoToToday}>
                  Today
                </Button>
              </Tooltip>
              <Tooltip title="Refresh">
                <Button icon={<ReloadOutlined />} onClick={loadData} />
              </Tooltip>
              <Tooltip title="Fullscreen">
                <Button icon={<FullscreenOutlined />} onClick={handleFullscreen} />
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Timeline */}
      <Card>
        {loading ? (
          <div style={{ padding: '20px 0' }}>
            <Skeleton active />
            <div style={{ marginTop: 16 }}>
              <Skeleton.Input style={{ width: '100%', height: 300 }} active />
            </div>
          </div>
        ) : (
          <>
            <div ref={timelineRef} style={{ width: '100%', height: '400px' }} />
            
            {vessels.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 0', 
                color: '#8c8c8c' 
              }}>
                No vessels scheduled for the selected period
              </div>
            )}
          </>
        )}
      </Card>

      {/* Legend */}
      <Card size="small" title="Legend" style={{ marginTop: 16 }}>
        <Row gutter={[16, 8]}>
          <Col span={8}>
            <Space>
              <div style={{ 
                width: 16, 
                height: 16, 
                background: vesselTypeColors.Container,
                borderRadius: 2 
              }} />
              <span>Container</span>
            </Space>
          </Col>
          <Col span={8}>
            <Space>
              <div style={{ 
                width: 16, 
                height: 16, 
                background: vesselTypeColors.RoRo,
                borderRadius: 2 
              }} />
              <span>RoRo</span>
            </Space>
          </Col>
          <Col span={8}>
            <Space>
              <div style={{ 
                width: 16, 
                height: 16, 
                background: vesselTypeColors.Bulk,
                borderRadius: 2 
              }} />
              <span>Bulk</span>
            </Space>
          </Col>
        </Row>
      </Card>
      </div>
    </FeatureErrorBoundary>
  );
};

export default BerthTimeline;