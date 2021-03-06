package com.x.attendance.assemble.control.jaxrs.attendancedetail;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.JsonElement;
import com.x.attendance.assemble.control.jaxrs.attendancedetail.exception.ExceptionAttendanceDetailProcess;
import com.x.base.core.project.annotation.JaxrsDescribe;
import com.x.base.core.project.annotation.JaxrsMethodDescribe;
import com.x.base.core.project.annotation.JaxrsParameterDescribe;
import com.x.base.core.project.http.ActionResult;
import com.x.base.core.project.http.EffectivePerson;
import com.x.base.core.project.http.HttpMediaType;
import com.x.base.core.project.jaxrs.ResponseFactory;
import com.x.base.core.project.jaxrs.StandardJaxrsAction;
import com.x.base.core.project.logger.Logger;
import com.x.base.core.project.logger.LoggerFactory;


@Path("attendancedetail/mobile")
@JaxrsDescribe("移动考勤打卡信息管理服务")
public class AttendanceDetailMobileAction extends StandardJaxrsAction{
	
	private static  Logger logger = LoggerFactory.getLogger( AttendanceDetailMobileAction.class );

	@JaxrsMethodDescribe( value = "根据ID获取移动打卡信息记录", action = ActionGetMobile.class )
	@GET
	@Path("{id}")
	@Produces(HttpMediaType.APPLICATION_JSON_UTF_8)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response get(@Context HttpServletRequest request, 
			@JaxrsParameterDescribe("移动考勤打卡信息ID") @PathParam("id") String id ) {
		ActionResult<ActionGetMobile.Wo> result = new ActionResult<>();
		EffectivePerson effectivePerson = this.effectivePerson(request);
		Boolean check = true;

		if(check){
			try {
				result = new ActionGetMobile().execute( request, effectivePerson, id );
			} catch (Exception e) {
				result = new ActionResult<>();
				Exception exception = new ExceptionAttendanceDetailProcess( e, "根据ID获取信息时发生异常！" );
				result.error( exception );
				logger.error( e, effectivePerson, request, null);
			}	
		}
		return ResponseFactory.getDefaultActionResultResponse(result);
	}
	
	@JaxrsMethodDescribe( value = "移动打卡信息记录明细查询", action = ActionListMobileWithFilter.class )
	@Path("filter/list/page/{page}/count/{count}")
	@PUT
	@Produces(HttpMediaType.APPLICATION_JSON_UTF_8)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response listDataForMobile(@Context HttpServletRequest request, 
			@JaxrsParameterDescribe("需要显示的页码") @PathParam("page") Integer page, 
			@JaxrsParameterDescribe("每页需要显示的条目数量") @PathParam("count") Integer count, 
			JsonElement jsonElement ) {
		ActionResult<List<ActionListMobileWithFilter.Wo>> result = new ActionResult<>();
		EffectivePerson effectivePerson = this.effectivePerson(request);
		Boolean check = true;

		if(check){
			try {
				result = new ActionListMobileWithFilter().execute( request, effectivePerson, page, count, jsonElement );
			} catch (Exception e) {
				result = new ActionResult<>();
				Exception exception = new ExceptionAttendanceDetailProcess( e, "根据ID获取信息时发生异常！" );
				result.error( exception );
				logger.error( e, effectivePerson, request, null);
			}	
		}
		return ResponseFactory.getDefaultActionResultResponse(result);
	}
	
	/**
	 * 打卡信息接入，移动端特点，会多次接入，部分接入，一次接入的信息不完整
	 * 接入后只保存 ，由定时代理定期进行数据整合，入库并且 分析
	 * 1-员工姓名 EmployeeName	
	   2-员工号   EmployeeNo
	   3-日期	RecordDateString
	   4-打卡时间 SignTime
	   6-打卡位置 
	   7-打卡坐标
	 * @author liyi_
	 */
	@JaxrsMethodDescribe( value = "移动打卡信息接入，移动端特点，会多次接入，部分接入，一次接入的信息不完整，接入完成后不直接进行分析", action = ActionReciveAttendanceMobile.class )
	@Path("recive")
	@POST
	@Produces(HttpMediaType.APPLICATION_JSON_UTF_8)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response reciveForMobile( @Context HttpServletRequest request, JsonElement jsonElement ) {
		ActionResult<ActionReciveAttendanceMobile.Wo> result = new ActionResult<>();
		EffectivePerson effectivePerson = this.effectivePerson(request);
		Boolean check = true;
		if(check){
			try {
				result = new ActionReciveAttendanceMobile().execute( request, effectivePerson, jsonElement );
			} catch (Exception e) {
				result = new ActionResult<>();
				Exception exception = new ExceptionAttendanceDetailProcess( e, "接入上下班打卡信息时发生异常！" );
				result.error( exception );
				logger.error( e, effectivePerson, request, null);
			}	
		}
		return ResponseFactory.getDefaultActionResultResponse(result);
	}
	
	@JaxrsMethodDescribe( value = "根据ID删除移动打卡信息", action = ActionDeleteMobile.class )
	@DELETE
	@Path("{id}")
	@Produces(HttpMediaType.APPLICATION_JSON_UTF_8)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response delete(@Context HttpServletRequest request, 
			@JaxrsParameterDescribe("移动考勤打卡信息ID") @PathParam("id") String id) {
		ActionResult<ActionDeleteMobile.Wo> result = new ActionResult<>();
		EffectivePerson effectivePerson = this.effectivePerson(request);
		Boolean check = true;
		if(check){
			try {
				result = new ActionDeleteMobile().execute( request, effectivePerson, id );
			} catch (Exception e) {
				result = new ActionResult<>();
				Exception exception = new ExceptionAttendanceDetailProcess( e, "根据ID删除下班打卡信息时发生异常！" );
				result.error( exception );
				logger.error( e, effectivePerson, request, null);
			}	
		}
		return ResponseFactory.getDefaultActionResultResponse(result);
	}
}