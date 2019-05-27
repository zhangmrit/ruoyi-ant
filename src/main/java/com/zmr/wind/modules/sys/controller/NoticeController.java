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
import com.zmr.wind.modules.sys.entity.Notice;
import com.zmr.wind.modules.sys.service.INoticeService;

/**
 * 通知公告 信息操作处理
 * 
 * @author zmr
 * @date 2019-05-08
 */
@Controller
@RequestMapping("/sys/notice")
public class NoticeController extends BaseController
{
    private String prefix = "sys/notice";
	
	@Autowired
	private INoticeService noticeService;
	
	@RequiresPermissions("sys:notice:view")
	@GetMapping()
	public String notice()
	{
	    return prefix + "/notice";
	}
	
	/**
	 * 查询通知公告列表
	 */
	@RequiresPermissions("sys:notice:list")
	@PostMapping("/list")
	@ResponseBody
	public TableDataInfo list(Notice notice)
	{
		startPage();
        List<Notice> list = noticeService.findList(notice);
		return getDataTable(list);
	}
	
	/**
	 * 新增通知公告
	 */
	@GetMapping("/add")
	public String add()
	{
	    return prefix + "/add";
	}
	
	/**
	 * 新增保存通知公告
	 */
	@RequiresPermissions("sys:notice:add")
	@Log(title = "通知公告", businessType = BusinessType.INSERT)
	@PostMapping("/add")
	@ResponseBody
	public R addSave(Notice notice)
	{		
		return toAjax(noticeService.save(notice));
	}

	/**
	 * 修改通知公告
	 */
	@GetMapping("/edit/{noticeId}")
	public String edit(@PathVariable("noticeId") Integer noticeId, ModelMap mmap)
	{
		Notice notice = noticeService.findById(noticeId);
		mmap.put("notice", notice);
	    return prefix + "/edit";
	}
	
	/**
	 * 修改保存通知公告
	 */
	@RequiresPermissions("sys:notice:edit")
	@Log(title = "通知公告", businessType = BusinessType.UPDATE)
	@PostMapping("/edit")
	@ResponseBody
	public R editSave(Notice notice)
	{		
		return toAjax(noticeService.update(notice));
	}
	
	/**
	 * 删除通知公告
	 */
	@RequiresPermissions("sys:notice:remove")
	@Log(title = "通知公告", businessType = BusinessType.DELETE)
	@PostMapping( "/remove")
	@ResponseBody
	public R remove(String ids)
	{		
		return toAjax(noticeService.deleteByIds(ids));
	}
	
}
