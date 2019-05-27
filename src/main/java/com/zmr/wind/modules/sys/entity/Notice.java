package com.zmr.wind.modules.sys.entity;

import java.io.Serializable;

import lombok.Data;

import javax.persistence.Id;
import java.util.Date;

/**
 * 通知公告表 sys_notice
 * 
 * @author zmr
 * @date 2019-05-08
 */
@Data
public class Notice implements Serializable
{
	private static final long serialVersionUID = 1L;
	

	/** 公告ID */
	@Id
	private Integer noticeId;

	/** 公告标题 */
	private String noticeTitle;

	/** 公告类型（1通知 2公告） */
	private String noticeType;

	/** 公告内容 */
	private String noticeContent;

	/** 公告状态（0正常 1关闭） */
	private String status;

	/** 创建者 */
	private String createBy;

	/** 创建时间 */
	private Date createTime;

	/** 更新者 */
	private String updateBy;

	/** 更新时间 */
	private Date updateTime;

	/** 备注 */
	private String remark;

}
