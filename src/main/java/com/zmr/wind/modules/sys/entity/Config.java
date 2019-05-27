package com.zmr.wind.modules.sys.entity;

import java.io.Serializable;

import lombok.Data;

import javax.persistence.Id;
import java.util.Date;

/**
 * 参数配置表 sys_config
 * 
 * @author zmr
 * @date 2019-05-08
 */
@Data
public class Config implements Serializable
{
	private static final long serialVersionUID = 1L;
	

	/** 参数主键 */
	@Id
	private Integer configId;

	/** 参数名称 */
	private String configName;

	/** 参数键名 */
	private String configKey;

	/** 参数键值 */
	private String configValue;

	/** 系统内置（Y是 N否） */
	private String configType;

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
