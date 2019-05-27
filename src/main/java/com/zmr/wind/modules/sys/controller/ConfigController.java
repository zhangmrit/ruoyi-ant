package com.zmr.wind.modules.sys.controller;

import java.util.List;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.zmr.wind.common.base.BaseController;
import com.zmr.wind.common.page.TableDataInfo;
import com.zmr.wind.core.annotation.Log;
import com.zmr.wind.core.bean.R;
import com.zmr.wind.core.enums.BusinessType;
import com.zmr.wind.modules.sys.entity.Config;
import com.zmr.wind.modules.sys.service.IConfigService;

/**
 * 参数配置 信息操作处理
 * 
 * @author zmr
 * @date 2019-05-08
 */
@Controller
@RequestMapping("/sys/config")
public class ConfigController extends BaseController
{
    private String prefix = "sys/config";
	
	@Autowired
	private IConfigService configService;
	
	@RequiresPermissions("sys:config:view")
	@GetMapping()
	public String config()
	{
	    return prefix + "/config";
	}
	
	/**
	 * 查询参数配置列表
	 */
	@RequiresPermissions("sys:config:list")
	@PostMapping("/list")
	@ResponseBody
	public TableDataInfo list(Config config)
	{
		startPage();
        List<Config> list = configService.findList(config);
		return getDataTable(list);
	}
	
	/**
	 * 新增参数配置
	 */
	@GetMapping("/add")
	public String add()
	{
	    return prefix + "/add";
	}
	
	/**
	 * 新增保存参数配置
	 */
	@RequiresPermissions("sys:config:add")
	@Log(title = "参数配置", businessType = BusinessType.INSERT)
	@PostMapping("/add")
	@ResponseBody
	public R addSave(Config config)
	{		
		return toAjax(configService.save(config));
	}

	/**
	 * 修改参数配置
	 */
	@GetMapping("/edit/{configId}")
	public String edit(@PathVariable("configId") Integer configId, ModelMap mmap)
	{
		Config config = configService.findById(configId);
		mmap.put("config", config);
	    return prefix + "/edit";
	}
	
	/**
	 * 修改保存参数配置
	 */
	@RequiresPermissions("sys:config:edit")
	@Log(title = "参数配置", businessType = BusinessType.UPDATE)
	@PostMapping("/edit")
	@ResponseBody
	public R editSave(Config config)
	{		
		return toAjax(configService.update(config));
	}
	
	/**
	 * 删除参数配置
	 */
	@RequiresPermissions("sys:config:remove")
	@Log(title = "参数配置", businessType = BusinessType.DELETE)
	@PostMapping( "/remove")
	@ResponseBody
	public R remove(String ids)
	{		
		return toAjax(configService.deleteByIds(ids));
	}
	
}
